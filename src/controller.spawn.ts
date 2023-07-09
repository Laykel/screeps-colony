const names: { [key in CreepRole]: string } = {
  harvester: 'Harvey',
  transporter: 'Porter',
  upgrader: 'Grey',
  builder: 'Billy',
};

const chooseBodyParts = (energy: number): BodyPartConstant[] => {
  console.log(energy);
  // TODO
  return [WORK, WORK, WORK, CARRY, MOVE, MOVE, MOVE, MOVE];
};

const chooseRole = (room: Room): CreepRole | null => {
  // TODO Maybe looking directly in memory is cheaper?
  const myCreeps = room.find(FIND_MY_CREEPS);

  const harvesters = myCreeps.filter(creep => creep.memory.role === 'harvester');
  const transporters = myCreeps.filter(creep => creep.memory.role === 'transporter');
  const upgraders = myCreeps.filter(creep => creep.memory.role === 'upgrader');
  const builders = myCreeps.filter(creep => creep.memory.role === 'builder');

  // TODO Parameterize numbers
  if (harvesters.length < 4) {
    return 'harvester';
  }

  if (Memory.mode === 'container' && transporters.length < 2) {
    return 'transporter';
  }

  if (upgraders.length < 2) {
    return 'upgrader';
  }

  const constructionSites = room.find(FIND_MY_CONSTRUCTION_SITES);

  if (constructionSites.length > 0 && builders.length < 1) {
    return 'builder';
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
