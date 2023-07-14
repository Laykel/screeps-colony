import { getCreepsMemoryByRole } from './shared.logic';

const names: { [key in CreepRole]: string } = {
  harvester: 'Harvey',
  miner: 'Minnie',
  transporter: 'Porter',
  operator: 'Perry',
  missionner: 'Missie',
  upgrader: 'Grey',
  builder: 'Billy',
};

const bodies: { [key in CreepRole]: (energyAvailable: number) => BodyPartConstant[] } = {
  harvester: () => [MOVE, CARRY, WORK, WORK],
  miner: () => [MOVE, WORK, WORK, WORK, WORK, WORK],
  transporter: () => [MOVE, MOVE, MOVE, MOVE, CARRY, CARRY, CARRY, CARRY],
  operator: energyAvailable => balancedBody(energyAvailable),
  missionner: energyAvailable => scoutBody(energyAvailable),
  upgrader: energyAvailable => balancedBody(energyAvailable),
  builder: energyAvailable => balancedBody(energyAvailable),
};

// This strategy isn't great at every energy level...
const balancedBody = (energy: number): BodyPartConstant[] => {
  const numberOfCarry = energy >= 800 ? 2 : 1;
  let energyLeft = energy - numberOfCarry * 50;

  const numberOfWork = Math.floor(energyLeft / 150);
  energyLeft -= numberOfWork * 100;

  const numberOfMove = Math.floor(energyLeft / 50);

  return [
    ...Array(numberOfMove).fill(MOVE),
    ...Array(numberOfWork).fill(WORK),
    ...Array(numberOfCarry).fill(CARRY),
  ];
};

const scoutBody = (energy: number): BodyPartConstant[] => {
  const numberOfParts = energy / 50 / 2;
  return [...Array(numberOfParts).fill(MOVE), ...Array(numberOfParts).fill(CARRY)];
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

    if (miners.length < 1 || (transporters.length > 0 && miners.length < 2)) {
      // TODO if (miners.length < Memory.sourceIds.length) {
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
        Memory.sourceIds.filter(
          id =>
            !getCreepsMemoryByRole('transporter')
              .map(memory => memory.sourceId)
              .includes(id),
        )[0] ?? Memory.sourceIds[0]
      );
    case 'upgrader':
      return (
        Memory.sourceIds.filter(
          id =>
            id !==
            Game.rooms[Memory.firstRoomName].controller?.pos.findClosestByPath(FIND_SOURCES)?.id,
        )[0] ?? Memory.sourceIds[0]
      );
    default:
      return Memory.sourceIds[0];
  }
};
