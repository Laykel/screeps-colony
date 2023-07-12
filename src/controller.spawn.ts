import { getCreepsMemoryByRole } from './shared.logic';

const names: { [key in CreepRole]: string } = {
  harvester: 'Harvey',
  transporter: 'Porter',
  upgrader: 'Grey',
  builder: 'Billy',
  operator: 'Perry',
  miner: 'Minnie',
};

const bodies: { [key in CreepRole]: (energyAvailable: number) => BodyPartConstant[] } = {
  miner: () => [MOVE, WORK, WORK, WORK, WORK, WORK],
  transporter: energyAvailable => transporterBody(energyAvailable),
  operator: energyAvailable => balancedBody(energyAvailable),
  upgrader: energyAvailable => balancedBody(energyAvailable),
  builder: energyAvailable => balancedBody(energyAvailable),
  harvester: () => [MOVE, CARRY, WORK, WORK],
};

const transporterBody = (energy: number) => {
  const numberOfCarry = energy % 100 === 0 ? energy / 50 / 2 + 1 : Math.ceil(energy / 50 / 2);
  return [...Array(numberOfCarry).fill(CARRY), ...Array(energy / 50 - numberOfCarry).fill(MOVE)];
};

// TODO Improve
const balancedBody = (energy: number): BodyPartConstant[] => {
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

// TODO Adapt number of creeps based on energy level in containers, and number of extensions (energyCapacityAvailable)
const chooseRole = (): CreepRole | null => {
  const harvesters = getCreepsMemoryByRole('harvester');
  const miners = getCreepsMemoryByRole('miner');
  const transporters = getCreepsMemoryByRole('transporter');
  const operators = getCreepsMemoryByRole('operator');
  const upgraders = getCreepsMemoryByRole('upgrader');
  const builders = getCreepsMemoryByRole('builder');

  if (Memory.mode === 'static_mining') {
    // TODO IMPORTANT Replace this nonsense with a queue in the spawner
    // Make sure a harvester stays around as long as no transporters are there
    if (harvesters.length < 1 && transporters.length < 1 && operators.length < 1) {
      return 'harvester';
    }

    if (miners.length < 1) {
      // if (miners.length < Memory.sourceIds.length) {
      return 'miner';
    }
    if (transporters.length < 2) {
      return 'transporter';
    }
    if (operators.length < 2) {
      return 'operator';
    }
  } else {
    if (harvesters.length < 3) {
      return 'harvester';
    }
  }

  if (upgraders.length < 3) {
    return 'upgrader';
  }

  if (Object.keys(Game.constructionSites).length > 0 && builders.length < 1) {
    return 'builder';
  }

  return null;
};

export const runSpawnController = (spawn: StructureSpawn, tick: number) => {
  const energyAvailable = spawn.room.energyAvailable;

  // Check if max energy capacity is reached, then spawn
  if (energyAvailable === spawn.room.energyCapacityAvailable) {
    const role = chooseRole();

    if (role === null) return;

    spawn.spawnCreep(
      bodies[role](energyAvailable),
      `${names[role]}-${tick - Memory.startingTick}`,
      {
        memory: { role, recharging: true, sourceId: assignedSourceId(role) },
      },
    );
  }
};

const assignedSourceId = (role: CreepRole): Id<Source> => {
  // TODO Rework this. Maybe assign a "main source id" and "upgrader source id" manually...
  switch (role) {
    case 'miner':
      return (
        Memory.sourceIds.filter(
          id =>
            !getCreepsMemoryByRole('miner')
              .map(memory => memory.sourceId)
              .includes(id),
        )[0] ?? Memory.sourceIds[0]
      );
    case 'transporter':
      return (
        Game.spawns[Memory.firstSpawnName].pos.findClosestByPath(FIND_SOURCES)?.id ??
        Memory.sourceIds[0]
      );
    case 'upgrader':
      return (
        Memory.sourceIds.filter(
          id => id !== Game.spawns[Memory.firstSpawnName].pos.findClosestByPath(FIND_SOURCES)?.id,
        )[0] ?? Memory.sourceIds[0]
      );
    default:
      return Memory.sourceIds[0];
  }
};
