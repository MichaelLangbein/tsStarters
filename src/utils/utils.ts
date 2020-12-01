import { BufferAttribute, BufferGeometry, DoubleSide, Mesh, MeshLambertMaterial } from 'three';



const cubeData = {
  'left': {
      normal: [-1, 0, 0],
      vertices: [
          [-1, 1, 1],
          [-1, 1, -1],
          [-1, -1, -1],
          [-1, 1, 1],
          [-1, -1, -1],
          [-1, -1, 1]
      ],
  },
  'right': {
      normal: [1, 0, 0],
      vertices: [
          [1, 1, 1],
          [1, -1, -1],
          [1, 1, -1],
          [1, 1, 1],
          [1, -1, 1],
          [1, -1, -1],
      ],
  },
  'top': {
      normal: [0, 1, 0],
      vertices: [
          [-1, 1, 1],
          [1, 1, 1],
          [1, 1, -1],
          [-1, 1, 1],
          [1, 1, -1],
          [-1, 1, -1],
      ],
  },
  'bottom': {
      normal: [0, -1, 0],
      vertices: [
          [-1, -1, 1],
          [1, -1, -1],
          [1, -1, 1],
          [-1, -1, 1],
          [-1, -1, -1],
          [1, -1, -1],
      ],
  },
  'front': {
      normal: [0, 0, 1],
      vertices: [
          [-1, 1, 1],
          [-1, -1, 1],
          [1, 1, 1],
          [1, 1, 1],
          [-1, -1, 1],
          [1, -1, 1],
      ],
  },
  'back': {
      normal: [0, 0, -1],
      vertices: [
          [-1, 1, -1],
          [1, 1, -1],
          [-1, -1, -1],
          [1, 1, -1],
          [1, -1, -1],
          [-1, -1, -1],
      ],
  },
};



export function createBlockMesh(data: number[][][], cubeSize: number, blockDimensions: [number, number, number], translation: [number, number, number], colorFunc: (n: number) => [number, number, number]): Mesh {
  const attrs = createAttributes(data, cubeSize, blockDimensions, translation, colorFunc);

  const voxelBlockGeometry = new BufferGeometry();
  voxelBlockGeometry.setAttribute('position', attrs.position);
  voxelBlockGeometry.setAttribute('normal', attrs.normal);
  voxelBlockGeometry.setAttribute('color', attrs.color);
  const voxelBlockMaterial = new MeshLambertMaterial({ vertexColors: true, side: DoubleSide, wireframe: false });
  const voxelBlock = new Mesh(voxelBlockGeometry, voxelBlockMaterial);

  return voxelBlock;
}

export function createAttributes(data: number[][][], cubeSize: number, blockDimensions: [number, number, number], translation: [number, number, number], colorFunc: (n: number) => [number, number, number]) {
  const [X, Y, Z] = blockDimensions;

  const vertices: number[][] = [];
  const normals: number[][] = [];
  const colors: number[][] = [];
  for (let x = 0; x < X; x++) {
      for (let y = 0; y < Y; y++) {
          for (let z = 0; z < Z; z++) {
              if (data[x][y][z] !== 0) {

                  // left neighbor
                  if (x === 0 || data[x - 1][y][z] === 0) {
                      for (const vertex of cubeData.left.vertices) {
                          vertices.push([
                              cubeSize * (vertex[0] / 2 + x) + translation[0],
                              cubeSize * (vertex[1] / 2 + y) + translation[1],
                              cubeSize * (vertex[2] / 2 + z) + translation[1]
                          ]);
                          normals.push(cubeData.left.normal);
                          colors.push(colorFunc(data[x][y][z]));
                      }
                  }

                  // right neighbor
                  if (x === X - 1 || data[x + 1][y][z] === 0) {
                      for (const vertex of cubeData.right.vertices) {
                          vertices.push([
                              cubeSize * (vertex[0] / 2 + x) + translation[0],
                              cubeSize * (vertex[1] / 2 + y) + translation[1],
                              cubeSize * (vertex[2] / 2 + z) + translation[1]
                          ]);
                          normals.push(cubeData.right.normal);
                          colors.push(colorFunc(data[x][y][z]));
                      }
                  }

                  // top neighbor
                  if (y === Y - 1 || data[x][y + 1][z] === 0) {
                      for (const vertex of cubeData.top.vertices) {
                          vertices.push([
                              cubeSize * (vertex[0] / 2 + x) + translation[0],
                              cubeSize * (vertex[1] / 2 + y) + translation[1],
                              cubeSize * (vertex[2] / 2 + z) + translation[1]
                          ]);
                          normals.push(cubeData.top.normal);
                          colors.push(colorFunc(data[x][y][z]));
                      }
                  }

                  // bottom neighbor
                  if (y === 0 || data[x][y - 1][z] === 0) {
                      for (const vertex of cubeData.bottom.vertices) {
                          vertices.push([
                              cubeSize * (vertex[0] / 2 + x) + translation[0],
                              cubeSize * (vertex[1] / 2 + y) + translation[1],
                              cubeSize * (vertex[2] / 2 + z) + translation[1]
                          ]);
                          normals.push(cubeData.bottom.normal);
                          colors.push(colorFunc(data[x][y][z]));
                      }
                  }

                  // front neighbor
                  if (z === Z - 1 || data[x][y][z + 1] === 0) {
                      for (const vertex of cubeData.front.vertices) {
                          vertices.push([
                              cubeSize * (vertex[0] / 2 + x) + translation[0],
                              cubeSize * (vertex[1] / 2 + y) + translation[1],
                              cubeSize * (vertex[2] / 2 + z) + translation[1]
                          ]);
                          normals.push(cubeData.front.normal);
                          colors.push(colorFunc(data[x][y][z]));
                      }
                  }

                  // back neighbor
                  if (z === 0 || data[x][y][z - 1] === 0) {
                      for (const vertex of cubeData.back.vertices) {
                          vertices.push([
                              cubeSize * (vertex[0] / 2 + x) + translation[0],
                              cubeSize * (vertex[1] / 2 + y) + translation[1],
                              cubeSize * (vertex[2] / 2 + z) + translation[1]
                          ]);
                          normals.push(cubeData.back.normal);
                          colors.push(colorFunc(data[x][y][z]));
                      }
                  }

              }
          }
      }
  }

  return {
      'position': new BufferAttribute(new Float32Array(vertices.flat()), 3),
      'normal': new BufferAttribute(new Float32Array(normals.flat()), 3),
      'color': new BufferAttribute(new Float32Array(colors.flat()), 3)
  };
}