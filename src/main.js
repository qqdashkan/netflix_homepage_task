import "./style.css";
import Sketch from "./sketch.js";

const sliderm = new Sliderm("#exampe-slider", {
  arrow: true,
  pagination: false,
  grouping: false,
  loop: true,
  preview: false,
  columns: 8,
  duration: 1000,
  spacing: 50,
  align: "center",
});

sliderm.on("slide.start", () => {
  console.log("Just starting to slide!");
});

sliderm.on("slide.end", () => {
  console.log("The slider is stopped.");
});

const container = document.getElementById("container");
new Sketch({
  dom: container,
});
