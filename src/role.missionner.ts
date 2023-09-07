import { handleRecharging, pickupFromAssignedDrop } from './shared.logic';

// const flag = Game.flags['remote-utrium'];
// creep.moveTo(flag);

// const resource = Game.getObjectById('64b040ae3e758505e9630c4a');
// if (creep.pickup(resource) === ERR_NOT_IN_RANGE) {
//     creep.moveTo(resource);
// }

// if (creep.transfer(storage, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
//     creep.moveTo(storage);
// }

export const runMissionnerRole = (creep: Creep) => {
  handleRecharging(creep, 'miss');

  if (creep.memory.recharging) {
    pickupFromAssignedDrop(creep);

    // creep.memory.counter ? creep.memory.counter++ : (creep.memory.counter = 1);

    // if (creep.memory.counter > 5) {
    //   creep.memory.counter = 0;
    //   creep.memory.recharging = false;
    // }
  } else {
    const link = creep.pos.findClosestByRange(FIND_MY_STRUCTURES, {
      filter: structure => structure.structureType === STRUCTURE_LINK,
    });

    if (link && creep.transfer(link, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
      creep.moveTo(link);
    }
  }
};
