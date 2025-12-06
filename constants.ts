import { CardContent, ShapeType } from './types';
import * as THREE from 'three';

// --- Content Configuration ---

export const INITIAL_CARDS: CardContent[] = [
  {
    id: 1,
    shape: ShapeType.TREE,
    title: "璀璨星光之树",
    text: "传说在很久以前的北欧森林深处，有一棵最古老的冷杉。每当平安夜降临，善良的森林精灵就会收集天上的星尘洒落在树梢。这棵树代表着永恒的生命与希望。当你看见那树顶闪耀的光芒时，不管身在何处，温暖都会指引你回家的路。",
    imageIcon: "tree",
    decorationColor: "border-green-800"
  },
  {
    id: 2,
    shape: ShapeType.SLEIGH, 
    title: "午夜的铃声",
    text: "雪花纷飞的午夜，如果你仔细聆听，会听到清脆的银铃声穿过云层。那是满载心意的雪橇划破长空的讯号。它不只是运送礼物，更是传递着人与人之间最纯粹的善意与挂念。每一个铃声，都是一声温柔的问候。",
    imageIcon: "sleigh",
    decorationColor: "border-red-800"
  },
  {
    id: 3,
    shape: ShapeType.GIFT,
    title: "只属于你的祝福",
    text: "亲爱的 [Name]，这份特别的祝福是专门为你准备的。愿新年的钟声为你带去欢乐，愿圣诞的烛光温暖你的心房。在这个充满魔法的节日里，希望所有的美好都如期而至，你就是在这个节日里收到的最珍贵的礼物。",
    imageIcon: "gift",
    decorationColor: "border-yellow-600"
  }
];

// Local file path as requested
export const AUDIO_URL = "./we-wish-you-a-merry-christmas-167774.mp3";

// --- 3D Shape Generation Math ---

const PARTICLE_COUNT = 3000; 

// Helper to add "cloud" fuzziness
const jitter = (amount: number = 0.05) => (Math.random() - 0.5) * amount;

export const generateShapeData = (shape: ShapeType): { positions: Float32Array, colors: Float32Array } => {
  const positions = new Float32Array(PARTICLE_COUNT * 3);
  const colors = new Float32Array(PARTICLE_COUNT * 3);
  const colorHelper = new THREE.Color();

  for (let i = 0; i < PARTICLE_COUNT; i++) {
    let x = 0, y = 0, z = 0;
    
    if (shape === ShapeType.TREE) {
      // --- TREE ---
      const scale = 0.75;

      if (i < 50) {
        // Star (Cloud Cluster)
        const r = Math.random() * 0.3 * scale;
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.random() * Math.PI;
        x = r * Math.sin(phi) * Math.cos(theta);
        y = (3.5 * scale) + r * Math.cos(phi);
        z = r * Math.sin(phi) * Math.sin(theta);
        colorHelper.set('#ffd700'); 
      } else if (i < 400) {
        // Ornaments (Spherical Clusters)
        const t = Math.random(); 
        const angle = Math.random() * Math.PI * 2;
        const coneRadius = (1 - t) * 3.0 * scale; 
        
        // Base position on cone surface
        const baseX = coneRadius * Math.cos(angle);
        const baseY = ((t * 6) - 2.5) * scale; 
        const baseZ = coneRadius * Math.sin(angle);

        // Add volume jitter
        x = baseX + jitter(0.2);
        y = baseY + jitter(0.2);
        z = baseZ + jitter(0.2);
        
        const randCol = Math.random();
        if (randCol < 0.33) colorHelper.set('#ff0000');
        else if (randCol < 0.66) colorHelper.set('#ffd700');
        else colorHelper.set('#0044ff');
      } else {
        // Leaves (Volume Cone)
        const t = Math.random(); 
        // Spiral distribution
        const angle = t * Math.PI * 50 + Math.random() * 0.5;
        const radius = (1 - t) * 3.0 * scale; 
        
        // Random radius fill (not just surface) to avoid lines
        const r = radius * Math.sqrt(Math.random()); 

        x = r * Math.cos(angle);
        y = ((t * 6) - 2.5) * scale;
        z = r * Math.sin(angle);
        
        // Add significant jitter for "fluffy" look
        x += jitter(0.15);
        y += jitter(0.15);
        z += jitter(0.15);

        colorHelper.setHSL(0.3 + Math.random() * 0.05, 0.8, 0.2 + Math.random() * 0.4);
      }
    } 
    else if (shape === ShapeType.SLEIGH) {
      // --- SLEIGH (Classic) ---
      const scale = 0.9;
      
      if (i < 800) {
        // Runners (2 Curved lines, thickened)
        // Two parallel runners at x = +/- 0.8
        const side = i % 2 === 0 ? 1 : -1;
        const t = (i / 800); // 0 to 1
        
        // Curve: goes up at front
        const zPos = (t - 0.5) * 4.0; // Length
        let yPos = -1.5;
        
        // Curl up at front (positive Z)
        if (zPos > 1.0) {
           yPos += Math.pow(zPos - 1.0, 2) * 0.5;
        }

        x = side * 0.8 + jitter(0.08); // Thickness
        y = yPos + jitter(0.08);
        z = zPos + jitter(0.08);
        
        colorHelper.set('#C0C0C0'); // Silver/Grey
      } else if (i < 2200) {
        // Body (Shell)
        // A curved surface from z=-1 to z=1.5
        const t = Math.random(); // 0 to 1
        const u = Math.random(); // 0 to 1
        
        const zPos = (t - 0.5) * 3.0; // Length
        
        // Profile shape (U-shape cross section)
        const angle = (u - 0.5) * Math.PI; // -PI/2 to PI/2
        
        // Body curve profile along length
        let radius = 0.9;
        let yOffset = -0.8;
        
        // Back is higher, Front is lower
        if (zPos < -1.0) {
            yOffset += ( -1.0 - zPos) * 0.5; // Rise at back
        }
        
        x = Math.sin(angle) * radius + jitter(0.1);
        y = Math.cos(angle) * radius * 0.6 + yOffset + jitter(0.1);
        z = zPos + jitter(0.1);

        colorHelper.set('#8B0000'); // Dark Red Wood
      } else {
        // Inside/Gifts/Seat cushion (Filler)
        const t = Math.random();
        x = (Math.random() - 0.5) * 1.2;
        y = -1.0 + Math.random() * 0.5;
        z = (Math.random() - 0.5) * 2.0;
        
        // Make it look like "stuff" inside
        colorHelper.setHSL(Math.random(), 0.8, 0.5);
      }
      
      // Rotate slightly to view better
      const rot = -Math.PI / 6;
      const xN = x;
      const yN = y * Math.cos(rot) - z * Math.sin(rot);
      const zN = y * Math.sin(rot) + z * Math.cos(rot);
      x=xN * scale; y=yN * scale; z=zN * scale;

    } 
    else if (shape === ShapeType.GIFT) {
      // --- GIFT (Box + Natural Bow) ---
      const boxSize = 2.0; 
      
      if (i < 2200) {
        // Solid Box (Volume filled near surface)
        const face = Math.floor(Math.random() * 6);
        const u = (Math.random() - 0.5) * boxSize;
        const v = (Math.random() - 0.5) * boxSize;
        const half = boxSize / 2;
        
        // Small thickness
        const depth = (Math.random()) * 0.1;

        if (face === 0) { x=half-depth; y=u; z=v; }
        else if (face === 1) { x=-half+depth; y=u; z=v; }
        else if (face === 2) { x=u; y=half-depth; z=v; }
        else if (face === 3) { x=u; y=-half+depth; z=v; }
        else if (face === 4) { x=u; y=v; z=half-depth; }
        else if (face === 5) { x=u; y=v; z=-half+depth; }
        
        // Jitter edges
        x += jitter(0.05);
        y += jitter(0.05);
        z += jitter(0.05);

        colorHelper.set('#b71c1c'); // Deep Red
        
      } else if (i < 2600) {
        // Ribbon Bands (Cross)
        const axis = i % 2; 
        const half = boxSize / 2 + 0.05;
        const bandW = 0.5;
        
        if (axis === 0) { // Wrap YZ
           x = (Math.random()-0.5) * bandW;
           if (Math.random()>0.5) y = (Math.random()-0.5)*boxSize; 
           else { y = (Math.random()>0.5 ? half : -half); z=(Math.random()-0.5)*boxSize; } 
           // Fix logic for simple cross band
           const r = Math.random();
           if(r<0.33) { x=(Math.random()-0.5)*bandW; y=half; z=(Math.random()-0.5)*boxSize; } // Top
           else if(r<0.66) { x=(Math.random()-0.5)*bandW; y=(Math.random()-0.5)*boxSize; z=half; } // Front
           else { x=(Math.random()-0.5)*bandW; y=(Math.random()-0.5)*boxSize; z=-half; } // Back
        } else { // Wrap XY
            // Simplified cross logic for visuals
            const r = Math.random();
            if(r<0.5) { z=(Math.random()-0.5)*bandW; y=half; x=(Math.random()-0.5)*boxSize; }
            else { z=(Math.random()-0.5)*bandW; x=half; y=(Math.random()-0.5)*boxSize; }
        }
        
        x += jitter(0.02); y += jitter(0.02); z += jitter(0.02);
        colorHelper.set('#ffd700'); 

      } else {
        // Natural Bow (Top of box)
        // Center: y = boxSize/2
        // Shape: Lemniscate of Bernoulli (Infinity sign / Bow)
        
        const t = Math.random() * Math.PI * 2;
        // Parametric equation for a figure-8 knot
        const scaleBow = 0.8;
        
        // Basic Bow Tie shape in X-Z plane
        // r^2 = a^2 cos(2theta)
        // x = r cos t, z = r sin t
        
        // We use a simpler "flower" petal logic for volume
        const angle = t;
        const r = Math.sin(2 * angle) * scaleBow;
        
        x = r * Math.cos(angle);
        z = r * Math.sin(angle);
        y = (boxSize / 2) + 0.2 + Math.abs(r) * 0.3; // Arch up slightly

        // Thickness/Volume
        x += jitter(0.15);
        y += jitter(0.15);
        z += jitter(0.15);
        
        colorHelper.set('#ffd700');
      }
    }

    positions[i * 3] = x;
    positions[i * 3 + 1] = y;
    positions[i * 3 + 2] = z;
    
    colors[i * 3] = colorHelper.r;
    colors[i * 3 + 1] = colorHelper.g;
    colors[i * 3 + 2] = colorHelper.b;
  }
  
  return { positions, colors };
};