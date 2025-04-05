// @ts-ignore
import {mp4box} from "./mp4box.js"

export interface MP4MediaTrack {
	id: number;
	created: Date;
	modified: Date;
	movie_duration: number;
	samples_duration: number;
	layer: number;
	alternate_group: number;
	volume: number;
	track_width: number;
	track_height: number;
	timescale: number;
	duration: number;
	bitrate: number;
	codec: string;
	language: string;
	nb_samples: number;
	type: string;
}

export interface MP4VideoData {
	width: number;
	height: number;
}

export interface MP4VideoTrack extends MP4MediaTrack {
	video: MP4VideoData;
}
export interface MP4AudioTrack extends MP4MediaTrack {
	audio: MP4AudioData;
}

export interface MP4Info {
	duration: number;
	timescale: number;
	fragment_duration: number;
	isFragmented: boolean;
	isProgressive: boolean;
	hasIOD: boolean;
	brands: string[];
	created: Date;
	modified: Date;
	tracks: MP4Track[];
	audioTracks: MP4AudioTrack[];
	videoTracks: MP4VideoTrack[];
}

export interface MP4AudioData {
	sample_rate: number;
	channel_count: number;
	sample_size: number;
}

export interface Moov {
	type: string;
	hdr_size: Number;
	size: Number;
	start: Number;
	traks: any;
	uuid: String | undefined;
}

export interface MP4File {
	onMoovStart?: () => void;
	onReady?: (info: MP4Info) => void;
	onError?: (e: string) => void;
	onSamples?: (track_id: number, _ref: any, samples: any) => void;
	setExtractionOptions: (id: number) => void;

	moov: Moov;

	appendBuffer(data: MP4ArrayBuffer): number;
	start(): void;
	stop(): void;
	flush(): void;
	getTrackById: (id: number) => Trak
}

type MP4Track = MP4VideoTrack | MP4AudioTrack;

export interface MP4Box {
	createFile(): MP4File;
	DataStream: new (arrayBuffer: ArrayBuffer, byteOffset: number, endianness: boolean) => XDataStream
}

export type MP4ArrayBuffer = ArrayBuffer & {fileStart: number};


export interface TrackOptions {
	timescale: number;
	width: number;
	height: number;
	nb_samples: number;
	avcDecoderConfigRecord: AllowSharedBufferSource | undefined;
}

export interface SampleOptions {
	duration: number;
	dts: number;
	cts: number;
	is_sync: boolean;
}

export interface MP4File {
	onMoovStart?: () => void;
	onReady?: (info: MP4Info) => void;
	onError?: (e: string) => void;

	appendBuffer(data: MP4ArrayBuffer): number;
	start(): void;
	stop(): void;
	flush(): void;
	addTrack(trackOptions: TrackOptions): MP4Track;
	addSample(track: MP4Track, data: ArrayBuffer, sampleOptions: SampleOptions):void;
	save(file: string):void;
}

export class XDataStream {
	static BIG_ENDIAN: boolean;
	static LITTLE_ENDIAN: boolean;
	buffer?: ArrayBuffer;
	constructor(arrayBuffer: ArrayBuffer, byteOffset: number, endianness: boolean) {}
	// TODO: Complete interface
}

export interface Trak {
	mdia?: {
		minf?: {
			stbl?: {
				stsd?: {
					entries: {
						avcC?: {
							write: (stream: XDataStream) => void
						}
						hvcC?: {
							write: (stream: XDataStream) => void
						}
					}[]
				}
			}
		}
	}
	// TODO: Complete interface
}
export default mp4box as MP4Box;
export const DataStreamx = mp4box.DataStream as XDataStream
