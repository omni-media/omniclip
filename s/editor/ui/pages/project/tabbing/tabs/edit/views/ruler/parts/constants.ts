
export const tickSteps = (timebase: number) => [
	{ major: 1000, minor: 1000 / timebase },
	{ major: 2000, minor: 1000 },
	{ major: 5000, minor: 1000 },
	{ major: 10000, minor: 1000 },
	{ major: 15000, minor: 5000 },
	{ major: 30000, minor: 10000 },
	{ major: 60000, minor: 15000 },
	{ major: 120000, minor: 30000 },
	{ major: 300000, minor: 60000 },
	{ major: 600000, minor: 60000 },
	{ major: 1800000, minor: 300000 },
	{ major: 3600000, minor: 900000 }
]
