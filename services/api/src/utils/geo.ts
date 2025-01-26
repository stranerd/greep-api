export function calculateDistanceBetween(coords1: [number, number], coords2: [number, number]) {
	const [lat1, lon1] = coords1
	const [lat2, lon2] = coords2

	const lat1radians = toRadians(lat1)
	const lat2radians = toRadians(lat2)

	const latRadians = toRadians(lat2 - lat1)
	const lonRadians = toRadians(lon2 - lon1)

	const a =
		Math.sin(latRadians / 2) * Math.sin(latRadians / 2) +
		Math.cos(lat1radians) * Math.cos(lat2radians) * Math.sin(lonRadians / 2) * Math.sin(lonRadians / 2)
	const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))

	const earthRadiusInMeters = 6371e3
	return earthRadiusInMeters * c
}

function toRadians(val: number) {
	return (Math.PI * val) / 180
}
