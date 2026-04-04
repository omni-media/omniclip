
export const settings = {
	timebase: {
		label: "Timebase",
		options: [
			{value: 23.98, label: '23.98 fps'},
			{value: 24,    label: '24 fps'},
			{value: 25,    label: '25 fps (PAL)'},
			{value: 29.97, label: '29.97 fps (NTSC)'},
			{value: 30,    label: '30 fps'},
			{value: 60,    label: '60 fps'},
		],
	},
	dropFrame: {
		label: "Drop Frame Timecode",
		options: [
			{value: true,  label: 'Yes (Drop Frame)'},
			{value: false, label: 'No (Non-Drop Frame)'},
		],
	},
	colorSpace: {
		label: "Color Space",
		options: [
			{value: 'rec709',      label: 'Rec. 709'},
			{value: 'display-p3',  label: 'Display P3'},
			{value: 'rec2020',     label: 'Rec. 2020'},
		],
	},
	sampleRate: {
		label: "Sample Rate",
		options: [
			{value: '44100', label: '44,100 Hz'},
			{value: '48000', label: '48,000 Hz'},
			{value: '96000', label: '96,000 Hz'},
		],
	},
	channels: {
		label: "Channels",
		options: [
			{value: 'mono',    label: 'Mono'},
			{value: 'stereo',  label: 'Stereo'},
			{value: '5.1',     label: '5.1 Surround'},
		],
	},
	format: {
    label: "Format",
    options: [
        {
            value: '16:9', label: '16:9 (Landscape)',
            resolutions: [
                {value: '1280x720',  label: '720p (HD)'},
                {value: '1920x1080', label: '1080p (Full HD)'},
                {value: '2560x1440', label: '1440p (QHD)'},
                {value: '3840x2160', label: '4K (UHD)'},
            ],
        },
        {
            value: '9:16', label: '9:16 (Vertical)',
            resolutions: [
                {value: '720x1280',  label: '720p (Vertical HD)'},
                {value: '1080x1920', label: '1080p (Vertical FHD)'},
                {value: '1440x2560', label: '1440p (Vertical QHD)'},
                {value: '2160x3840', label: '4K (Vertical UHD)'},
            ],
        },
{value: '1:1', label: '1:1 (Square)',
    resolutions: [
        {value: '720x720',   label: '720p'},
        {value: '1080x1080', label: '1080p'},
        {value: '1440x1440', label: '1440p'},
        {value: '2160x2160', label: '4K'},
    ],
},
{value: '3:2', label: '3:2 (Photo)',
    resolutions: [
        {value: '960x640',   label: '640p'},
        {value: '1440x960',  label: '960p'},
        {value: '1620x1080', label: '1080p'},
        {value: '2160x1440', label: '1440p'},
    ],
},
{value: '4:3', label: '4:3 (Classic)',
    resolutions: [
        {value: '640x480',   label: '480p'},
        {value: '800x600',   label: '600p'},
        {value: '1024x768',  label: '768p'},
        {value: '1440x1080', label: '1080p'},
    ],
},
{
    value: '21:9', label: '21:9 (Ultrawide)',
    resolutions: [
        {value: '2560x1080', label: '1080p'},
        {value: '3440x1440', label: '1440p'},
        {value: '5120x2160', label: '5K'},
    ],
},
    ],
},
} as const

