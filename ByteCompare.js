class ByteCodes {
    constructor(data) {
        this.states = new Map();
        this.discharge = 0;

        this.#fillStates(data);
    }

    #fillStates(data) {
        for (const state of data) { 
            this.states.set(state, 1 << this.discharge++);
        }
    }

    get(key) {
        return this.states.get(key);
    }

    getMany(keys) {
        return keys.map(key => this.get(key));
    }
}

class ByteState {
    constructor(state = 0) {
        this.state = state;
    }

    or(state) {
        return new ByteState(this.state | state);
    }

    and(state) {
        return new ByteState(this.state & state);
    }

    orMany(states) {
        return new ByteState(states.reduce((acc, state) => acc | state, this.state));
    }

    andMany(states) {
        return new ByteState(states.reduce((acc, state) => acc & state, this.state));
    }

    xor(state) {
        return new ByteState(this.state ^ state);
    }

    xorMany(states) {
        return new ByteState(states.reduce((acc, state) => acc ^ state, this.state));
    }
}

class Adapter {
    constructor(byteCodes, byteState, initialState) {
        this.byteCodes = byteCodes;
        this.byteState = byteState;

        if (initialState) {
            this.addMany(initialState);
        }
    }
    add(key) {
        this.byteState = this.byteState.or(this.byteCodes.get(key));
    }

    addMany(keys) {
        this.byteState = this.byteState.orMany(this.byteCodes.getMany(keys));
    }

    has(adapter) {
        return (this.byteState.state & adapter.byteState.state) !== 0;
    }

    same(adapter) { 
        return this.byteState.state === adapter.byteState.state;
    }

    toggle(key) {
        this.byteState = this.byteState.xor(this.byteCodes.get(key));
    }

    toggleMany(keys) { 
        this.byteState = this.byteState.xorMany(this.byteCodes.getMany(keys));
    }
    
    getState() {
        return this.byteState.state;
    }

    getStateBinary() {
        return this.byteState.state.toString(2);
    }

    getSize() {
        return this.byteState.state.toString(2).length;
    }
}
 

module.exports = class ByteCompare {
    constructor(states) {
        this.byteCodes = new ByteCodes(states);
    }

    createState(initialState) {
        return new Adapter( 
            this.byteCodes,
            new ByteState(),
            initialState,
        );
    }
}
