export enum ShapeType {
  TREE = 'TREE',
  SLEIGH = 'SLEIGH',
  GIFT = 'GIFT'
}

export interface CardContent {
  id: number;
  shape: ShapeType;
  title: string;
  text: string;
  imageIcon: string; 
  decorationColor: string;
}

export interface ParticlePoint {
  x: number;
  y: number;
  z: number;
  r: number;
  g: number;
  b: number;
}