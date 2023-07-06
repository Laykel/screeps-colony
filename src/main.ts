import { runHarvester } from './roles.harvester';
import roleTransporter from './roles.transporter';
import roleUpgrader from './roles.upgrader';
import roleBuilder from './roles.builder';

// TODO tsconfig, eslint, prettier, build to screeps folder
// TODO Watcher for build, place for declare and types?

type CreepRole = 'harvester' | 'transporter' | 'upgrader' | 'builder';

declare global {
  interface Memory {}

  interface CreepMemory {
    role: CreepRole,
    building: boolean,
    upgrading: boolean,
  }

  interface FlagMemory {}
  interface SpawnMemory {}
  interface RoomMemory {}
}

export const loop = () => {
    var tower = Game.getObjectById('128c8f8e6af5f270d1e774f7' as Id<StructureTower>);

    if(tower) {
        var closestDamagedStructure = tower.pos.findClosestByRange(FIND_STRUCTURES, {
            filter: (structure) => structure.hits < structure.hitsMax
        });
        if(closestDamagedStructure) {
            tower.repair(closestDamagedStructure);
        }

        var closestHostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
        if(closestHostile) {
            tower.attack(closestHostile);
        }
    }

    for(var name in Game.creeps) {
        var creep = Game.creeps[name];
        if(creep.memory.role == 'harvester') {
            runHarvester(creep);
        }
        if(creep.memory.role == 'transporter') {
            roleTransporter.run(creep);
        }
        if(creep.memory.role == 'upgrader') {
            roleUpgrader.run(creep);
        }
        if(creep.memory.role == 'builder') {
            roleBuilder.run(creep);
        }
    }
}
