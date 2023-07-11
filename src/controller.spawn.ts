const names: { [key in CreepRole]: string } = {
  harvester: 'Harvey',
  transporter: 'Porter',
  upgrader: 'Grey',
  builder: 'Billy',
  operator: 'Perry',
  miner: 'Minnie',
};

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
  // TODO Maybe looking directly in memory is cheaper?
  const myCreeps = room.find(FIND_MY_CREEPS);

  const harvesters = myCreeps.filter(creep => creep.memory.role === 'harvester');
  const transporters = myCreeps.filter(creep => creep.memory.role === 'transporter');
  const upgraders = myCreeps.filter(creep => creep.memory.role === 'upgrader');
  const builders = myCreeps.filter(creep => creep.memory.role === 'builder');
  const operators = myCreeps.filter(creep => creep.memory.role === 'operator');

  // TODO Parameterize numbers
  if (Memory.mode === 'container' && transporters.length < 1) {
    return 'transporter';
  }

  const numberOfHarvesters = Memory.mode === 'container' ? 5 : 2;
  if (harvesters.length < numberOfHarvesters) {
    return 'harvester';
  }

  if (upgraders.length < 3) {
    return 'upgrader';
  }

  const constructionSites = room.find(FIND_MY_CONSTRUCTION_SITES);

  if (constructionSites.length > 0 && builders.length < 1) {
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
