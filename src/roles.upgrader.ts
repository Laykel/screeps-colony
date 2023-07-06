const roleUpgrader = {
    run: function(creep: Creep) {
        if(creep.memory.upgrading && creep.store[RESOURCE_ENERGY] == 0) {
            creep.memory.upgrading = false;
            creep.say('🔄 harvest');
	    }
	    if(!creep.memory.upgrading && creep.store.getFreeCapacity() == 0) {
	        creep.memory.upgrading = true;
	        creep.say('⚡ upgrade');
	    }

	    if(creep.memory.upgrading) {
            if(creep.upgradeController(creep.room.controller!) == ERR_NOT_IN_RANGE) {
                creep.moveTo(creep.room.controller!, {visualizePathStyle: {stroke: '#ffffff'}});
            }
        }
        else {
            //var sources = creep.room.find(FIND_);
            const container = Game.getObjectById('ac3c75be9428f8c42fb7a4eb' as Id<StructureContainer>)!;
            if(creep.withdraw(container, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.moveTo(container, {visualizePathStyle: {stroke: '#ffaa00'}});
            }
        }
	}
};

export default roleUpgrader;
