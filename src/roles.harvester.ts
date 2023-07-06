// TODO
const findStructure = (creep: Creep, structureType: StructureConstant) => {
  creep.room.find(FIND_STRUCTURES, {filter: (structure) => structure.structureType === structureType})
}

export const runHarvester = (creep: Creep) => {
  if(creep.store.getFreeCapacity() > 0) {
        var sources = creep.room.find(FIND_SOURCES);
        if(creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) {
            creep.moveTo(sources[0], {visualizePathStyle: {stroke: '#ffaa00'}});
        }
    }
    else {
        //var targets = creep.room.find(FIND_STRUCTURES, {
        //        filter: (structure) => {
        //            return //(structure.structureType == STRUCTURE_EXTENSION ||
        //                    //structure.structureType == STRUCTURE_SPAWN ||
        //                    structure.structureType == STRUCTURE_CONTAINER; //&&
        //                    //structure.structureType == STRUCTURE_TOWER) &&
        //                    //structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
        //        }
        //});
        //if(targets.length > 0) {
        //    if(creep.transfer(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
        //        creep.moveTo(targets[0], {visualizePathStyle: {stroke: '#ffffff'}});
        //    }
        //}
        var container = Game.getObjectById('ac3c75be9428f8c42fb7a4eb' as Id<StructureContainer>)!;
        if (creep.transfer(container, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
            creep.moveTo(container);
        }
    }
};

// export default roleHarvester;
