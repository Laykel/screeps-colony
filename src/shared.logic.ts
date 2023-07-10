// TODO Deprecated: use findClosestStructure and findClosest!
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
  const container = findStructureInRoom(creep.room, STRUCTURE_CONTAINER);

  if (container && creep.withdraw(container, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
    creep.moveTo(container);
  }
};

// TODO Use this in all creeps that need energy, except Harveys
export const withdrawEnergy = (creep: Creep) => {
  if (Memory.mode === 'container') {
    withdrawFromContainer(creep);
    // TODO If container is empty, get from source
  } else {
    harvestFromSource(creep);
  }
};

export const transferToContainer = (creep: Creep) => {
  const container = findStructureInRoom(creep.room, STRUCTURE_CONTAINER);

  if (container && creep.transfer(container, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
    creep.moveTo(container);
  }
};

export const transferToStructures = (creep: Creep) => {
  const targets = creep.room.find(FIND_STRUCTURES, {
    filter: structure => {
      return (
        (structure.structureType === STRUCTURE_EXTENSION ||
          structure.structureType === STRUCTURE_SPAWN) &&
        structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0
      );
    },
  });

  if (targets.length > 0) {
    if (creep.transfer(targets[0], RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
      creep.moveTo(targets[0]);
    }
  }
};
