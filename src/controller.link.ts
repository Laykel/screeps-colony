export const runLinkController = (link: StructureLink, linkMemory: LinkMemory) => {
  if (linkMemory.target && link.cooldown === 0 && link.store.getFreeCapacity() === 0) {
    const targetLink = Game.getObjectById(linkMemory.target);

    if (targetLink) {
      link.transferEnergy(targetLink);
    }
  }
};
