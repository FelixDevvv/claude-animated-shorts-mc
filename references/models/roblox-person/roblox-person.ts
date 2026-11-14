import * as THREE from "three";

/**
 * Procedural Roblox-inspired humanoid for the Cartoon 3D Shorts pipeline.
 *
 * This is the DEFAULT 3D character option.
 * It is intentionally generated from Three.js primitives so the skill does
 * not depend on an external character file or texture.
 *
 * The Francarlos character is a separate opt-in asset and must never be
 * selected automatically. See SKILL.md.
 */

export type RobloxPersonOptions = {
  skin?: THREE.ColorRepresentation;
  shirt?: THREE.ColorRepresentation;
  pants?: THREE.ColorRepresentation;
  shoes?: THREE.ColorRepresentation;
  hair?: THREE.ColorRepresentation;
  eyeColor?: THREE.ColorRepresentation;
  scale?: number;
  name?: string;
};

export type RobloxPersonPose = {
  leftArm?: number; rightArm?: number; leftLeg?: number; rightLeg?: number;
  torso?: number; head?: number;
};

const DEFAULTS = {
  skin: 0xf1c7a5, shirt: 0x2f6fed, pants: 0x252b38, shoes: 0x17191f,
  hair: 0x24201d, eyeColor: 0x111111, scale: 1,
};

function mat(color: THREE.ColorRepresentation, roughness = 0.82) {
  return new THREE.MeshStandardMaterial({ color, roughness, metalness: 0 });
}

function box(width: number, height: number, depth: number, material: THREE.Material) {
  return new THREE.Mesh(new THREE.BoxGeometry(width, height, depth), material);
}

export class RobloxPerson extends THREE.Group {
  readonly parts = {
    root: new THREE.Group(), torso: new THREE.Group(), head: new THREE.Group(),
    leftArm: new THREE.Group(), rightArm: new THREE.Group(),
    leftLeg: new THREE.Group(), rightLeg: new THREE.Group(),
  };

  readonly options: RobloxPersonOptions;

  constructor(options: RobloxPersonOptions = {}) {
    super();
    this.options = { ...DEFAULTS, ...options };
    this.name = options.name ?? "RobloxPerson";

    const skin = mat(this.options.skin!);
    const shirt = mat(this.options.shirt!);
    const pants = mat(this.options.pants!);
    const shoes = mat(this.options.shoes!);
    const hair = mat(this.options.hair!);
    const eye = mat(this.options.eyeColor!, 0.45);
    const s = this.options.scale!;

    this.add(this.parts.root);
    this.parts.root.scale.setScalar(s);

    const torso = box(1.15, 1.35, 0.62, shirt);
    torso.position.y = 2.95;
    this.parts.torso.add(torso);

    const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.16, 0.16, 16), skin);
    neck.position.y = 3.68;
    this.parts.torso.add(neck);

    const head = box(0.92, 0.92, 0.92, skin);
    head.position.y = 4.27;
    this.parts.head.add(head);

    const hairCap = box(0.96, 0.20, 0.96, hair);
    hairCap.position.y = 4.78;
    this.parts.head.add(hairCap);

    for (const x of [-0.17, 0.17]) {
      const eyeMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.055, 0.055, 0.025, 16), eye);
      eyeMesh.rotation.x = Math.PI / 2;
      eyeMesh.position.set(x, 4.30, 0.47);
      this.parts.head.add(eyeMesh);
    }

    const armL = box(0.38, 1.28, 0.38, shirt);
    armL.position.y = -0.64;
    this.parts.leftArm.add(armL);
    this.parts.leftArm.position.set(-0.77, 3.45, 0);
    const armR = box(0.38, 1.28, 0.38, shirt);
    armR.position.y = -0.64;
    this.parts.rightArm.add(armR);
    this.parts.rightArm.position.set(0.77, 3.45, 0);

    const handL = box(0.36, 0.34, 0.36, skin);
    handL.position.y = -0.80;
    this.parts.leftArm.add(handL);
    const handR = box(0.36, 0.34, 0.36, skin);
    handR.position.y = -0.80;
    this.parts.rightArm.add(handR);

    const legL = box(0.48, 1.35, 0.48, pants);
    legL.position.y = -0.675;
    this.parts.leftLeg.add(legL);
    this.parts.leftLeg.position.set(-0.30, 2.27, 0);
    const legR = box(0.48, 1.35, 0.48, pants);
    legR.position.y = -0.675;
    this.parts.rightLeg.add(legR);
    this.parts.rightLeg.position.set(0.30, 2.27, 0);

    const shoeL = box(0.52, 0.25, 0.68, shoes);
    shoeL.position.set(0, -1.40, 0.08);
    this.parts.leftLeg.add(shoeL);
    const shoeR = box(0.52, 0.25, 0.68, shoes);
    shoeR.position.set(0, -1.40, 0.08);
    this.parts.rightLeg.add(shoeR);

    this.parts.root.add(this.parts.torso, this.parts.head, this.parts.leftArm, this.parts.rightArm, this.parts.leftLeg, this.parts.rightLeg);
    this.applyPose({});
  }

  applyPose(pose: RobloxPersonPose) {
    this.parts.leftArm.rotation.z = pose.leftArm ?? 0;
    this.parts.rightArm.rotation.z = pose.rightArm ?? 0;
    this.parts.leftLeg.rotation.x = pose.leftLeg ?? 0;
    this.parts.rightLeg.rotation.x = pose.rightLeg ?? 0;
    this.parts.torso.rotation.y = pose.torso ?? 0;
    this.parts.head.rotation.y = pose.head ?? 0;
    return this;
  }

  walk(t: number, amount = 0.45) {
    const phase = t * Math.PI * 2;
    this.parts.leftArm.rotation.x = Math.sin(phase) * amount;
    this.parts.rightArm.rotation.x = -Math.sin(phase) * amount;
    this.parts.leftLeg.rotation.x = -Math.sin(phase) * amount;
    this.parts.rightLeg.rotation.x = Math.sin(phase) * amount;
    this.parts.root.position.y = Math.abs(Math.sin(phase)) * 0.045;
    return this;
  }

  idle(t: number) {
    this.parts.root.position.y = Math.sin(t * Math.PI * 2) * 0.018;
    this.parts.head.rotation.y = Math.sin(t * 1.7) * 0.035;
    return this;
  }

  jump(t: number, height = 0.45) {
    const p = Math.max(0, Math.min(1, t));
    this.parts.root.position.y = Math.sin(p * Math.PI) * height;
    return this;
  }
}

export function createRobloxPerson(options: RobloxPersonOptions = {}) {
  return new RobloxPerson(options);
}