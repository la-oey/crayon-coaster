var levels = {
	"basic_far" : {
		nindex: 0,
		marbleLoc: { x: .1, y: .075 },
		cupLoc: { x: .9, y: .9 },
		blockLoc: []
	},
	"basic_short" : {
		nindex: 1,
		marbleLoc: { x: .1, y: .075 },
		cupLoc: { x: .5, y: .5 },
		blockLoc: []
	},
	"basic_flat" : {
		nindex: 2,
		marbleLoc: { x: .1, y: .075 },
		cupLoc: { x: .9, y: .5 },
		blockLoc: []
	},
	"basic_steep" : {
		nindex: 3,
		marbleLoc: { x: .1, y: .075 },
		cupLoc: { x: .5, y: .9 },
		blockLoc: []
	},
	"basic_drop" : {
		nindex: 4,
		marbleLoc: { x: .1, y: .075 },
		cupLoc: { x: .1, y: .9 },
		blockLoc: []
	},
	"block_med" : {
		nindex: 5,
		marbleLoc: { x: .1, y: .075 },
		cupLoc: { x: .9, y: .9 },
		blockLoc: [{ x: 0.5, y: 0.5, width: 0.25, height: 0.4 }]
	},
	"block_long" : {
		nindex: 6,
		marbleLoc: { x: .1, y: .075 },
		cupLoc: { x: .9, y: .9 },
		blockLoc: [{ x: 0.5, y: 0.6, width: 0.25, height: 0.8 }]
	},
	"tunnel_wide" : {
		nindex: 7,
		marbleLoc: { x: .1, y: .075 },
		cupLoc: { x: .9, y: .9 },
		blockLoc: [
			{ x: 0.5, y: 0.9, width: 0.25, height: 0.2 },
			{ x: 0.5, y: 0.1, width: 0.25, height: 0.2 }]
	},
	"tunnel_narrow" : {
		nindex: 8,
		marbleLoc: { x: .1, y: .075 },
		cupLoc: { x: .9, y: .9 },
		blockLoc: [
			{ x: 0.5, y: 0.8, width: 0.25, height: 0.4 },
			{ x: 0.5, y: 0.2, width: 0.25, height: 0.4 }]
	},
	"diagonal_descent" : {
		nindex: 9,
		marbleLoc: { x: .1, y: .075 },
		cupLoc: { x: .9, y: .9 },
		blockLoc: [
			{ x: 0.3, y: 0.7, width: 0.2, height: 0.6 },
			{ x: 0.7, y: 0.3, width: 0.2, height: 0.6 }]
	},
	"diagonal_ascent" : {
		nindex: 10,
		marbleLoc: { x: .1, y: .075 },
		cupLoc: { x: .9, y: .9 },
		blockLoc: [
			{ x: 0.7, y: 0.75, width: 0.2, height: 0.5 },
			{ x: 0.3, y: 0.25, width: 0.2, height: 0.5 }]
	},
	"contain_corner" : {
		nindex: 11,
		marbleLoc: { x: .1, y: .075 },
		cupLoc: { x: .9, y: .9 },
		blockLoc: [
			{ x: 0.6, y: 0.75, width: 0.1, height: 0.4 },
			{ x: 0.75, y: 0.6, width: 0.3, height: 0.1 }]
	},
	"boomerang_middle" : {
		nindex: 12,
		marbleLoc: { x: .5, y: .075 },
		cupLoc: { x: .5, y: .9 },
		blockLoc: [{ x: 0.5, y: 0.5, width: 0.5, height: 0.1 }]
	},
	"boomerang_left" : {
		nindex: 13,
		marbleLoc: { x: .35, y: .075 },
		cupLoc: { x: .35, y: .9 },
		blockLoc: [{ x: 0.35, y: 0.5, width: 0.4, height: 0.1 }]
	}
}