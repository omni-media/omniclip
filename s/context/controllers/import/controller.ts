import {generate_id} from "@benev/slate"
import { omnislate } from "../../context.js";
import { Actions } from "../../actions.js";
import { AnyMedia, Image, Audio, Video } from "../../../components/omni-media/types.js";
import {ImageEffect, AudioEffect, VideoEffect, State, ProjectFile} from "../../types.js"
import {EffectProjectFile, ImageProjectFile, AudioProjectFile, VideoProjectFile} from "../../types.js"
import {AnimationProjectFile, FilterProjectFile, TextProjectFile} from "../../types.js"
import {Font, FontStyle, TextAlign, TextEffect} from "../../types.js" 
import { Media } from "../../controllers/media/controller.js";
import { BlobReader, BlobWriter, ZipReader } from "@zip.js/zip.js/index.js";
import {find_place_for_new_effect} from "../timeline/utils/find_place_for_new_effect.js"
import {AnimationIn, AnimationOut, animationIn, animationOut} from "../compositor/parts/animation-manager.js"
import {Filter, FilterType} from "../compositor/parts/filter-manager.js"
import { filters } from "fabric"

export class Import extends Map<string, AnyMedia> {
    constructor(private actions: Actions, private mediaController: Media) {
        super();
    }
    
    getMimeType(filename: string): string {
        let extension = filename.split('.').pop()?.toLowerCase();
        if (!extension) return "application/octet-stream";

        switch (extension) {
            case 'jpg':
            case 'jpeg':
                return 'image/jpeg';
            case 'png':
                return 'image/png';
            case 'gif':
                return 'image/gif';
            case 'webp':
                return 'image/webp';
            case 'mp4':
                return 'video/mp4';
            case 'mp3':
                return 'audio/mpeg';
            case 'wav':
                return 'audio/wav';
            case 'ogg':
                return 'audio/ogg';
            case 'webm':
                return 'video/webm';
            case 'avi':
                return 'video/x-msvideo';
            case 'mov':
                return 'video/quicktime';
            case 'zip':
                return 'application/zip';
            case 'json':
                return 'application/json';
            default:
                return 'application/octet-stream';
        }
    }

    importZip = async (input: HTMLInputElement) => {
        let imported_file = input.files?.[0];
        if (imported_file) {
            if (imported_file.type === "application/zip" || imported_file.name.endsWith(".zip")) {
                try {
                    let zipReader = new ZipReader(new BlobReader(imported_file));
                    let entries = await zipReader.getEntries();
                    let projectFile: File | undefined;
                    for (let entry of entries) {
                        let mimeType = this.getMimeType(entry.filename);
                        if (!entry.directory && entry.getData) {
                            let fileBlob = await entry.getData(new BlobWriter());
                            let file = new File([fileBlob], entry.filename, { type: mimeType });
                            if(mimeType.startsWith('image') 
                                    || mimeType.startsWith('audio') 
                                    || mimeType.startsWith('video')){
                                await this.mediaController.import_from_file(file);
                            }else if(entry.filename === 'project.json'){
                                projectFile = file;
                            }
                        }
                    }
                    await zipReader.close();
                    if(projectFile){
                        console.log('project file loaded');
                        this.#processProjectFile(projectFile);
                    }
                } catch (error) {
                    console.error("Error uncompress zip file:", error);
                }
            } else {
                console.warn("File selected not is a ZIP file");
            }
        }
    };
    
    #readProjectFile = (file: File): Promise<ProjectFile> => {
        return new Promise<ProjectFile>((resolve) => {
            let reader = new FileReader();
            reader.onload = () => {
                resolve(JSON.parse(reader.result as string) as ProjectFile);
            };
            reader.readAsText(file);
        });
    }
    
    #setResolution = (width: number, height: number) => {
        omnislate.context.actions.set_project_resolution(width, height)
        omnislate.context.controllers.compositor.set_canvas_resolution(width, height)
    }
    
    #processProjectFile = async (file: File) => {
        let project = await this.#readProjectFile(file)
        this.#setResolution(project.resolution.width, project.resolution.height)
        project.tracks.forEach(async (o, i) => { 
            omnislate.context.actions.add_track()
            for (let effect of o.effects){
                if(effect.kind === "image"){
                    this.add_image_timeline(effect as ImageProjectFile, i)
                }else if(effect.kind === "audio"){
                    this.add_audio_timeline(effect as AudioProjectFile, i)
                }else if(effect.kind === "video"){
                    this.add_video_timeline(effect as VideoProjectFile, i)
                }else if(effect.kind === "text"){
                    this.add_text_timeline(effect as TextProjectFile, i)
                }
            }
        })
    };

    
    #getImportedFile = async (name: string): Promise<AnyMedia|null> => {
        let medias = await omnislate.context.controllers.media.getImportedFiles();
        let media = null; 
        medias.forEach((o) => {
            if(o.file.name === name){
                media = o;
                return;
            }
        })
        return media;
    }
    
    #getImageDimensions = async (file: File): Promise<{ width: number; height: number }> => {
        return new Promise((resolve, reject) => {
            let img = new Image();
            img.onload = () => {
                resolve({ width: img.naturalWidth, height: img.naturalHeight });
            };
            img.onerror = reject;
            let objectURL = URL.createObjectURL(file);
            img.src = objectURL;
        });
    }
    
    #getVideoMetadata = async (file: File): Promise<{ duration: number; width: number; height: number }> => {
        return new Promise((resolve, reject) => {
            let video = document.createElement('video');
            video.preload = 'metadata';
            video.onloadedmetadata = () => {
                let metadata = {
                    duration: video.duration,
                    width: video.videoWidth,
                    height: video.videoHeight
                };
                resolve(metadata);
                URL.revokeObjectURL(video.src); 
            };
            video.onerror = () => {
                reject(new Error('Erro to load video'));
            };
            let objectURL = URL.createObjectURL(file);
            video.src = objectURL;
        });
    }

    #getAudioDuration = async (file: File): Promise<number> => {
        return new Promise((resolve, reject) => {
            let audio = new Audio();
            audio.preload = 'metadata';
            audio.onloadedmetadata = () => {
                resolve(audio.duration);
                URL.revokeObjectURL(audio.src);
            };
            audio.onerror = () => {
                reject(new Error('Erro ao carregar o arquivo de áudio'));
            };
            let objectURL = URL.createObjectURL(file);
            audio.src = objectURL;
        });
    }
    
    #createImageEffect = async (image: Image, effectProject: ImageProjectFile, track: number) => {
        let imageDimensions = await this.#getImageDimensions(image.file)
        let scale = omnislate.context.state.settings.width / imageDimensions.width
        let effect: ImageEffect = {
                    id: generate_id(),
                    kind: "image",
                    file_hash: image.hash,
                    duration: effectProject.duration,
                    start_at_position: effectProject.start,
                    start: effectProject.start,
                    end: effectProject.start + effectProject.duration,
                    track: track,
                    name: image.file.name,
                    rect: {
                        position_on_canvas: {x: effectProject.x, y: effectProject.y},
                        width: effectProject.width,
                        height: effectProject.height,
                        rotation: effectProject.rotation,
                        scaleX: effectProject.scaleX,
                        scaleY: effectProject.scaleY
                    }
            }
        return effect;
    }
    
    #createVideoEffect = async (video: Video, effectProject: VideoProjectFile, track: number) => {
        let metadata = await this.#getVideoMetadata(video.file)
        let scale = omnislate.context.state.settings.width / metadata.width
        let state = omnislate.context.state
//        let adjusted_duration_to_timebase = effectProject.duration !== 0 ? effectProject.duration : metadata.duration
        const adjusted_duration_to_timebase = Math.floor(effectProject.duration / (1000/state.timebase)) * (1000/state.timebase) - 200
		const effect: VideoEffect = {
			frames: video.frames,
			id: generate_id(),
			name: video.file.name,
			kind: "video",
			file_hash: video.hash,
			raw_duration: video.duration,
			duration: adjusted_duration_to_timebase,
			start_at_position: effectProject.start_at_position,
			start: effectProject.start,
			end: adjusted_duration_to_timebase,
			track: track,
			thumbnail: video.thumbnail,
                        volume: effectProject.volume,
			rect: {
				position_on_canvas: {x: effectProject.x, y: effectProject.y},
				width: effectProject.width,
				height: effectProject.height,
				rotation: 0,
				scaleX: 1,
				scaleY: 1
			}
		}
        return effect;
    }
    
    #createAudioEffect = async (audio: Audio, effectProject: AudioProjectFile, track: number) => {
        let duration = await this.#getAudioDuration(audio.file);
        let state = omnislate.context.state;
        let adjusted_duration_to_timebase = effectProject.duration != 0 ? effectProject.duration : duration * 1000
        let effect: AudioEffect = {
			id: generate_id(),
			kind: "audio",
			name: audio.file.name,
			file_hash: audio.hash,
			raw_duration: adjusted_duration_to_timebase,
			duration: adjusted_duration_to_timebase,
			start_at_position: effectProject.start_at_position,
			start: effectProject.start,
			end: effectProject.end,
			track: track,
                        volume: effectProject.volume
		}
        return effect;
    }
    
    #createTextEffect = async (effectProject: TextProjectFile, track: number) => {
        const effect: TextEffect = {
			id: generate_id(),
			kind: "text",
			start_at_position: effectProject.start_at_position,
			duration: effectProject.duration,
			start: effectProject.start,
			end: effectProject.end,
			track: track,
			size: effectProject.size,
			content: effectProject.content,
			style: effectProject.style as FontStyle,
			font: effectProject.font as Font,
			color: effectProject.color,
			align: effectProject.align as TextAlign,
			rect: {
                            position_on_canvas: {x: effectProject.x,y: effectProject.y,},
                            scaleX: effectProject.scaleX,
                            scaleY: effectProject.scaleY,
                            width: effectProject.width,
                            height: effectProject.height,
                            rotation: effectProject.rotation,
			}
		}
        return effect;
    }
    
    add_video_timeline = async (effectProject: VideoProjectFile, track: number) => {
        let media = await this.#getImportedFile(effectProject.file_name);
        if(media !== null){
            console.log(media);
            let videoEffect = await this.#createVideoEffect(media as Video, effectProject, track)
            await omnislate.context.controllers.compositor.managers.videoManager.add_video_effect(videoEffect, media.file)
            for(let o of effectProject.animations) {
                await this.addAnimation(videoEffect, o)
            };
        }
    }
    
    add_audio_timeline = async (effectProject: AudioProjectFile, track: number) => {
        let media = await this.#getImportedFile(effectProject.file_name);
        if(media !== null){
            let audioEffect = await this.#createAudioEffect(media as Audio, effectProject, track)
            omnislate.context.controllers.compositor.managers.audioManager.add_audio_effect(audioEffect, media.file)
        }
    }
    
    add_image_timeline = async (effectProject: ImageProjectFile, track: number) => {
        let media = await this.#getImportedFile(effectProject.file_name);
        if(media !== null){
            let imageEffect = await this.#createImageEffect(media as Image, effectProject, track)
            await omnislate.context.controllers.compositor.managers.imageManager.add_image_effect(imageEffect, media.file)
            for( let o of effectProject.animations) {
                await this.addAnimation(imageEffect, o)
            };
            for( let o of effectProject.filters) {
                await this.addEffect(imageEffect, o)
            };
        }
    }
    
    add_text_timeline = async (effectProject: TextProjectFile, track: number) => {
        let effect = await this.#createTextEffect(effectProject, track)
        await omnislate.context.controllers.compositor.managers.textManager.add_text_effect(effect)
    }
    
    addAnimation = (effect: ImageEffect | VideoEffect, animation: AnimationProjectFile) => {
        let animManager = omnislate.context.controllers.compositor.managers.animationManager;
        let anim: AnimationIn | AnimationOut | null = null;
        if (animationIn.includes(animation.kind as (typeof animationIn)[number])) {
            anim = {
                targetEffect: effect, 
                type: animation.kind as (typeof animationIn)[number], 
                duration: animation.duration
            } as AnimationIn;
        } else if (animationOut.includes(animation.kind as (typeof animationOut)[number])) {
            anim = {
                targetEffect: effect, 
                type: animation.kind as (typeof animationOut)[number],
                duration: animation.duration
            } as AnimationOut;
        }
        if (anim) {
            animManager.selectAnimation(effect, anim, omnislate.context.state)
        }
    }
    
    addEffect = (effect: ImageEffect | VideoEffect, filterProject: FilterProjectFile) => {
        let filterManager = omnislate.context.controllers.compositor.managers.filtersManager;
        let filter: Filter = {
            targetEffectId: effect.id,
            type: filterProject.type as FilterType 
        };
        filterManager.addFilterToEffect(effect, filter.type)
        
        let filterFabric = new filters[filter.type]()
        let hasNumberParameter = typeof filterFabric.getMainParameter() === "number"
        if(hasNumberParameter){
            filterManager.updateEffectFilter(effect, filter.type, filterProject.value)
        }        
    }
}