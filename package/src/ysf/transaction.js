import {options} from './utils'
var queue = [];

export var transaction = {
    isInTransation: false,
    enqueue: function (instance) {
        if (typeof instance === 'object') {
            queue.push(instance)
        }
        if (!this.isInTransation) {
            this.isInTransation = true
            console.log(queue);
            if (instance) options.updateBatchNumber++;
            var globalBatchNumber = options.updateBatchNumber
            //console.log(globalBatchNumber);
            var renderQueue = queue
            queue = []
            var updateComponent = options.immune.updateComponent;
           
            for (var i = 0, n = renderQueue.length; i < n; i++) {
                var inst = renderQueue[i]
                console.log(inst);
                try {
                    if (inst._updateBatchNumber === globalBatchNumber) {
                        
                        updateComponent(inst);
                    }
                } catch (e) {
                    /* istanbul ignore next */
                    console.warn(e)
                }
            }
            this.isInTransation = false;
        }

    }
}