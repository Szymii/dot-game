export type Obstacle = Rectangle | Circle;

type Rectangle = {
  type: "rectangle";
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
};

type Circle = {
  type: "circle";
  x: number;
  y: number;
  radius: number;
  color: string;
};
