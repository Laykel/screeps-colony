// Finding things ---------------------------------------------------
export const isStructureOneOf = (
  structureType: StructureConstant,
  structureTypeList: StructureConstant[],
) => structureTypeList.includes(structureType);

export const getCreepsMemoryByRole = (role: CreepRole): CreepMemory[] =>
  Object.values(Memory.creeps).filter(creepMemory => creepMemory.role === role);

export const findStructureInRoom = (room: Room, structureType: StructureConstant) => {
  return room.find(FIND_STRUCTURES, {
    filter: structure => structure.structureType === structureType,
  })[0];
};

export const findClosestStructure = (pos: RoomPosition, structureType: StructureConstant) => {
  return pos.findClosestByPath(FIND_STRUCTURES, {
    filter: structure => structure.structureType === structureType,
  });
};

export const findClosest = (pos: RoomPosition, find: FindConstant, creepName = 'unknown') => {
  const target = pos.findClosestByPath(find);

  if (!target) {
    console.log(`No object of type ${find} was found by creep ${creepName}`);
  }
  return target;
};

// Getting energy ---------------------------------------------------
export const handleRecharging = (creep: Creep, message: string) => {
  if (!creep.memory.recharging && creep.store[RESOURCE_ENERGY] === 0) {
    creep.memory.recharging = true;
    creep.say('recharge');
  }
  if (creep.memory.recharging && creep.store.getFreeCapacity() === 0) {
    creep.memory.recharging = false;
    creep.say(message);
  }
};

export const pickupFromAssignedDrop = (creep: Creep) => {
  // Get assigned source
  if (creep.memory.sourceId) {
    const source = Game.getObjectById(creep.memory.sourceId);
    const dropped = source && source.pos.findClosestByRange(FIND_DROPPED_RESOURCES);

    if (dropped && creep.pickup(dropped) == ERR_NOT_IN_RANGE) {
      creep.moveTo(dropped);
    }
  } else {
    console.log(`Creep ${creep.name} doesn't have an assigned sourceId`);
  }
};

export const harvestFromSource = (creep: Creep) => {
  const source = creep.pos.findClosestByPath(FIND_SOURCES);
  if (!source) {
    console.log(`No source found by creep ${creep.name}`);
    return;
  }

  if (creep.harvest(source) == ERR_NOT_IN_RANGE) {
    creep.moveTo(source);
  }
};

export const withdrawFromContainer = (creep: Creep) => {
  let storage;
  if (Memory.mainStorageId) {
    storage = Game.getObjectById(Memory.mainStorageId);
  } else {
    storage = findStructureInRoom(creep.room, STRUCTURE_CONTAINER) as StructureContainer;
  }

  if (!storage) {
    harvestFromSource(creep);
  } else {
    if (creep.withdraw(storage, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
      creep.moveTo(storage);
    }
  }
};

export const withdrawEnergy = (creep: Creep) => {
  if (Memory.mainStorageId) {
    // TODO Withdraw from main storage
    withdrawFromContainer(creep);
  } else {
    harvestFromSource(creep);
  }
};

// Transferring energy ----------------------------------------------
export const transferToContainer = (creep: Creep) => {
  const container = findStructureInRoom(creep.room, STRUCTURE_CONTAINER);

  if (container && creep.transfer(container, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
    creep.moveTo(container);
  }
};

export const transferToMainStorage = (creep: Creep) => {
  if (Memory.mainStorageId) {
    const storage = Game.getObjectById(Memory.mainStorageId);

    if (storage && creep.transfer(storage, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
      creep.moveTo(storage);
    }
  }
};

export const transferToSpawn = (creep: Creep) => {
  const target = creep.pos.findClosestByPath(FIND_MY_STRUCTURES, {
    filter: structure => {
      return (
        (structure.structureType === STRUCTURE_EXTENSION ||
          structure.structureType === STRUCTURE_SPAWN) &&
        structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0
      );
    },
  });

  if (target) {
    if (creep.transfer(target, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
      creep.moveTo(target);
    }
  }
};
