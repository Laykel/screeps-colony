const getCreepsMemoryByRole = (role: CreepRole): CreepMemory[] =>
  Object.values(Memory.creeps).filter(creepMemory => creepMemory.role === role);

const names: { [key in CreepRole]: string } = {
  harvester: 'Harvey',
  transporter: 'Porter',
  upgrader: 'Grey',
  builder: 'Billy',
  operator: 'Perry',
  miner: 'Minnie',
};

// const minerBodyType = {
//   1: MOVE,
//   5: WORK,
// };
// const balancedBodyType = {
//   half: WORK,
//   quarter: CARRY,
//   quarter2: MOVE,
// };

// const bodyTypes: { [key: string]: BodyPartConstant[] } = {
//   balanced: [],
//   worker: [WORK, WORK, WORK, WORK, WORK, MOVE], // Ideal for miners
//   scout: [WORK, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE],
// };

const chooseBodyParts = (energy: number): BodyPartConstant[] => {
  // TODO This sucks
  const parts: BodyPartConstant[] = [CARRY];
  let energyLeft = energy - 50;

  const numberOfWork = Math.ceil(energyLeft / 200);

  for (let i = 0; i < numberOfWork; i++) {
    parts.push(WORK);
    energyLeft -= 100;
  }

  const numberOfMove = Math.floor(energyLeft / 50);

  for (let i = 0; i < numberOfMove; i++) {
    parts.push(MOVE);
    energyLeft -= 50;
  }

  return parts;
};

const chooseRole = (room: Room): CreepRole | null => {
  const harvesters = getCreepsMemoryByRole('harvester');
  const transporters = getCreepsMemoryByRole('transporter');
  const upgraders = getCreepsMemoryByRole('upgrader');
  const builders = getCreepsMemoryByRole('builder');
  const operators = getCreepsMemoryByRole('operator');

  // TODO Parameterize numbers
  if (Memory.mode === 'container' && transporters.length < 1) {
    return 'transporter';
  }

  const numberOfHarvesters = Memory.mode === 'container' ? 4 : 2;
  if (harvesters.length < numberOfHarvesters) {
    return 'harvester';
  }

  if (upgraders.length < 3) {
    return 'upgrader';
  }

  if (Object.keys(Game.constructionSites).length > 0 && builders.length < 1) {
    return 'builder';
  }

  const towers = room.find(FIND_STRUCTURES, {
    filter: structure => structure.structureType === STRUCTURE_TOWER,
  });
  if (towers.length > 0 && operators.length < 1) {
    return 'operator';
  }

  return null;
};

export const runSpawnController = (spawn: StructureSpawn, tick: number) => {
  const energyAvailable = spawn.room.energyAvailable;

  // Check if max energy capacity is reached, then spawn
  if (energyAvailable === spawn.room.energyCapacityAvailable) {
    const role = chooseRole(spawn.room);

    if (role === null) return;

    spawn.spawnCreep(chooseBodyParts(energyAvailable), `${names[role]}-${tick}`, {
      memory: { role },
    });
  }
};
