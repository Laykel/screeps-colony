import {
  handleRecharging,
  pickupFromAssignedDrop,
  transferToMainStorage,
  transferToSpawn,
} from './shared.logic';

export const runTransporterRole = (creep: Creep) => {
  if (Memory.mode !== 'static_mining') return;

  handleRecharging(creep, 'transport');

  // Get energy if needed
  if (creep.memory.recharging) {
    pickupFromAssignedDrop(creep);
  } else {
    // Fill main storage if there is one
    if (Memory.mainStorageId) {
      // TODO Consider filling the spawn first if there are no operators
      transferToMainStorage(creep);
    } else {
      transferToSpawn(creep);
    }
  }
};
