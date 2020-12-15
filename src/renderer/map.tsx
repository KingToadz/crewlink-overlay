import React, { useEffect, useRef, useMemo } from 'react';
import { Player, AmongUsState, GameState } from '../common/AmongUsState';
import { maps } from './cosmetics';


export interface CanvasProps {
	players: Player[];
	gamestate: AmongUsState;
}

export interface MapProps {
	players: Player[];
	gamestate: AmongUsState;
}

const MapOverlay: React.FC<MapProps> = function ({ players, gamestate }: MapProps) {
	return (
		// (gamestate.gameState == GameState.MENU || gamestate.gameState == GameState.UNKNOWN || gamestate.gameState == GameState.DISCUSSION) ? <div></div> : 
		<Canvas players={players} gamestate={gamestate} /> 
	);
};

function Canvas({ players, gamestate }: CanvasProps) {
	const canvas = useRef<HTMLCanvasElement>(null);
	const mapImg = useRef<HTMLImageElement>(null);
	const lobbyImg = useRef<HTMLImageElement>(null);

	// TODO: fix colors
	const colors = ["#FF000", "#0000FF", " #00FF00", "#FF000", "#0000FF", " #00FF00", "#FF000", "#0000FF", " #00FF00", "#FF000", "#0000FF", " #00FF00"]

	const myPlayer = useMemo(() => {
		if (!gamestate || !gamestate.players) {
			return undefined;
		} else {
			return gamestate.players.find((p) => p.isLocal);
		}
	}, [gamestate.players]);


	useEffect(() => {
		(async () => {
			if (!canvas.current || !mapImg.current || !lobbyImg.current) return;
			const ctx = canvas.current.getContext('2d');
			if (!ctx) return;
			

			if (!lobbyImg.current.complete) {
				await new Promise(r => {
					if (lobbyImg?.current)
						lobbyImg.current.onload = r;
				});
			}

			if (!mapImg.current.complete) {
				await new Promise(r => {
					if (mapImg?.current)
						mapImg.current.onload = r;
				});
			}

			var ref = gamestate.gameState == GameState.LOBBY ? lobbyImg.current : mapImg.current;

			canvas.current.width = ref.width;
			canvas.current.height = ref.height;
			ctx.globalAlpha = 0.6
			ctx.clearRect(0, 0, canvas.current.width, canvas.current.height);
			ctx.drawImage(ref, 0, 0);

			// change to myplayer for local play
			if(players) {
				players.map(player => {
					ctx.fillStyle = colors[player.colorId]
					if(canvas.current) {
						if (gamestate.gameState == GameState.LOBBY) {
							var offsetY = 0;
							var offsetX = 0;

							var x = (canvas.current.width / 2) + (player.x * 90) + offsetX;
							var y = (canvas.current.width / 2) - (player.y * 90) - offsetY;
						} else {
							var offsetY = 23 * 14;
							var offsetX = 17 * 4;

							var x = (canvas.current.width / 2) + (player.x * 23) + offsetX;
							var y = (canvas.current.width / 2) - (player.y * 23) - offsetY;
						}
					
						const radius = 20;

						ctx.beginPath();
						ctx.arc(x, y, radius, 0, 2 * Math.PI, false);
						ctx.fill();
						ctx.lineWidth = 5;
						ctx.strokeStyle = '#003300';
						ctx.stroke();
						ctx.font = "20px Arial";
						ctx.textAlign = "center";
						ctx.fillStyle = "#FFF"
						ctx.fillText(player.name, x, y + 30);
					}
				});
			}
		})();

	}, [players]);

	return (
		<>
			<img src={maps[0]} ref={mapImg} style={{ display: 'none' }} />
			<img src={maps[1]} ref={lobbyImg} style={{ display: 'none' }} />
			<canvas className='canvas' ref={canvas} /> 
		</>
	);
}

export default MapOverlay;


// export default function MapOverlay(playerList: Player[]) {
// 	const useCanvas = (callback:any) => {
// 		const canvasRef = React.useRef<any>();
	
// 		React.useEffect(() => {
// 		const canvas = canvasRef.current;
// 		if(canvas) {
// 			const ctx = canvas.getContext('2d');
// 			callback([canvas, ctx]);
// 		}
// 		}, []);

// 		console.log("draw")
	
// 		return canvasRef;
// 	}

// 	const colors = ["#FF000", "#0000FF", " #00FF00", "#FF000", "#0000FF", " #00FF00", "#FF000", "#0000FF", " #00FF00", "#FF000", "#0000FF", " #00FF00"]
// 	console.log("draw")
//   	const Canvas = () => {
// 		const [position, setPosition] = React.useState({});
// 		const canvasRef = useCanvas(([canvas, ctx]) => {
// 			var imageObj1 = new Image();
// 			imageObj1.src = maps[0]
// 			imageObj1.onload = function() {
// 				ctx.drawImage(imageObj1,0,0);
// 				console.log("draw")
// 			}
			
// 			if(playerList) {
// 				playerList.map(player => {
// 					ctx.fillColor = 'green';//colors[player.colorId]
// 					ctx.fillRect(player.x - 10, player.y - 10, player.x, player.y)
// 					console.log(player.x)
// 				});
// 			}

// 			const x = canvas.width;
// 			const y = canvas.height;
// 			setPosition({ x, y });
// 		});
		
// 		return (<canvas ref={canvasRef} width={1900} height={1080} />);
// 	}
	
// 	return (
		
// 	<div>
// 		{Canvas()}
// 	</div>
// 	)
// }