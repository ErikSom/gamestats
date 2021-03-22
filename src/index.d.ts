type Options = {
	autoPlace?: boolean;
	targetFPS?: number;
	redrawInterval?: number;
	maximumHistory?: number;
	scale?: number;
	memoryUpdateInterval?: number;
	memoryMaxHistory?: number;
	FONT_FAMILY?: string;
	COLOR_FPS_BAR?: string;
	COLOR_FPS_AVG?: string;
	COLOR_TEXT_LABEL?: string;
	COLOR_TEXT_TO_LOW?: string;
	COLOR_TEXT_BAD?: string;
	COLOR_TEXT_TARGET?: string;
	COLOR_BG?: string;
}
declare class GameStats {
	dom: HTMLCanvasElement;

	constructor(options?: Options)
	begin: (label?: string, color?: string) => void;
	end: (label?: string, color?: string) => void;
}
export default GameStats;
