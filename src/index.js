import "./style.css";
import { init } from "./game/game.js";
import { renderShipList, renderPlayerBoard } from "./ui/dom.js";
import "./ui/event.js";

init();
renderShipList();
renderPlayerBoard();