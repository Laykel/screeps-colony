const roleBuilder = {
    run: function(creep: Creep) {
	    if(creep.memory.building && creep.store[RESOURCE_ENERGY] == 0) {
            creep.memory.building = false;
            creep.say('🔄 harvest');
	    }
	    if(!creep.memory.building && creep.store.getFreeCapacity() == 0) {
	        creep.memory.building = true;
	        creep.say('🚧 build');
	    }

	    if(creep.memory.building) {
	        var targets = creep.room.find(FIND_CONSTRUCTION_SITES);
            if(targets.length) {
                if(creep.build(targets[0]) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(targets[0], {visualizePathStyle: {stroke: '#ffffff'}});
                }
            }
	    }
	    else {
	        //var sources = creep.room.find(FIND_SOURCES);
	        var container = Game.getObjectById('ac3c75be9428f8c42fb7a4eb' as Id<StructureContainer>)!;
          if(creep.withdraw(container, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
              creep.moveTo(container, {visualizePathStyle: {stroke: '#ffaa00'}});
          }
	    }
	}
};

export default roleBuilder;
