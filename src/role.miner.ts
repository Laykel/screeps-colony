export const runMinerRole = (creep: Creep) => {
  if (creep.memory.sourceId) {
    // Get assigned source
    const source = Game.getObjectById(creep.memory.sourceId);

    // TODO If there is a container within one block of source, make sure to move on top of it
    //   Make that check in scheduled task, store info

    // Harvest and let it drop
    if (source && creep.harvest(source) === ERR_NOT_IN_RANGE) {
      creep.moveTo(source);
    }
  }
};
