import { getRoomCreepsMemoryByRole } from './shared.logic';

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
  const numberOfCarry = energy >= 800 ? 4 : 1;
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
const chooseRole = (roomName: string, roomMode: Mode): CreepRole | null => {
  const harvesters = getRoomCreepsMemoryByRole(roomName, 'harvester');
  const miners = getRoomCreepsMemoryByRole(roomName, 'miner');
  const transporters = getRoomCreepsMemoryByRole(roomName, 'transporter');
  const operators = getRoomCreepsMemoryByRole(roomName, 'operator');
  const upgraders = getRoomCreepsMemoryByRole(roomName, 'upgrader');
  const builders = getRoomCreepsMemoryByRole(roomName, 'builder');

  if (roomMode === 'static_mining') {
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

  if (upgraders.length < 2) {
    return 'upgrader';
  }

  if (
    Object.keys(Object.values(Game.constructionSites).filter(site => site.room?.name === roomName))
      .length > 0 &&
    builders.length < 1
  ) {
    return 'builder';
  }

  return null;
};

export const runSpawnController = (spawn: StructureSpawn, tick: number) => {
  const energyAvailable = spawn.room.energyAvailable;

  // Check if max energy capacity is reached, then spawn
  if (energyAvailable === spawn.room.energyCapacityAvailable) {
    const role = chooseRole(spawn.room.name, spawn.room.memory.mode);

    if (role === null) return;

    spawn.spawnCreep(
      bodies[role](energyAvailable),
      `${names[role]}-${tick - Memory.startingTick}`,
      {
        memory: {
          role,
          recharging: true,
          sourceId: assignedSourceId(spawn.room, role),
          room: spawn.room.name,
        },
      },
    );
  }
};

const assignedSourceId = (room: Room, role: CreepRole): Id<Source> => {
  // TODO Rework this. Maybe assign a "main source id" and "upgrader source id" manually...
  const sourceIds = room.memory.sources;

  switch (role) {
    case 'miner':
      return (
        sourceIds.filter(
          id =>
            !getRoomCreepsMemoryByRole(room.name, 'miner')
              .map(memory => memory.sourceId)
              .includes(id),
        )[0] ?? sourceIds[0]
      );
    case 'transporter':
      return (
        sourceIds.filter(
          id =>
            !getRoomCreepsMemoryByRole(room.name, 'transporter')
              .map(memory => memory.sourceId)
              .includes(id),
        )[0] ?? sourceIds[0]
      );
    case 'upgrader':
      return (
        sourceIds.filter(
          id =>
            id !==
            Game.rooms[Memory.firstRoomName].controller?.pos.findClosestByPath(FIND_SOURCES)?.id,
        )[0] ?? sourceIds[0]
      );
    default:
      return sourceIds[0];
  }
};
