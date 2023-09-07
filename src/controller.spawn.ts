import { getRoomCreepsMemoryByRole } from './shared.logic';

const ballerOperator = [...Array(13).fill(MOVE), ...Array(19).fill(WORK), ...Array(18).fill(CARRY)];

const names: { [key in CreepRole]: string } = {
  harvester: 'Harvey',
  miner: 'Minnie',
  transporter: 'Porter',
  operator: 'Perry',
  missionner: 'Missie',
  upgrader: 'Grey',
  builder: 'Billy',
};

const bodyCost = (body: BodyPartConstant[]) =>
  body
    .map(part => {
      switch (part) {
        case 'tough':
          return 10 as number;
        case 'move':
        case 'carry':
          return 50;
        case 'work':
          return 100;
        case 'attack':
          return 80;
        case 'ranged_attack':
          return 150;
        case 'heal':
          return 250;
        case 'claim':
          return 600;
      }
    })
    .reduce((previous, current) => previous + current);

// TODO Warning: no more than 50 parts are allowed
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
  if (energy > 4000) return ballerOperator;

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
const chooseRole = (room: Room): CreepRole | null => {
  const harvesters = getRoomCreepsMemoryByRole(room.name, 'harvester');
  const miners = getRoomCreepsMemoryByRole(room.name, 'miner');
  const transporters = getRoomCreepsMemoryByRole(room.name, 'transporter');
  const operators = getRoomCreepsMemoryByRole(room.name, 'operator');
  const upgraders = getRoomCreepsMemoryByRole(room.name, 'upgrader');
  const builders = getRoomCreepsMemoryByRole(room.name, 'builder');

  if (room.memory.mode === 'static_mining') {
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
    if (room.memory.mainStorage) {
      if (room.energyCapacityAvailable <= 4000 && operators.length < 2) {
        return 'operator';
      } else if (operators.length < 1) {
        return 'operator';
      }
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
    Object.keys(Object.values(Game.constructionSites).filter(site => site.room?.name === room.name))
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
  if (energyAvailable >= spawn.room.energyCapacityAvailable / 2) {
    const role = chooseRole(spawn.room);

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
