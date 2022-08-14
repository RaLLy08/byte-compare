class ByteCodes {
    constructor(data) {
        this.statesToBytes = new Map();
        this.bytesToStates = new Map();
        this.discharge = 0;

        if (data.length > 31) throw new Error("Too many states");

        this.#fillStates(data);
    }

    #fillStates(data) {
        for (const state of data) { 
            this.statesToBytes.set(state, 1 << this.discharge++);
            this.bytesToStates.set(1 << this.discharge - 1, state);
        }
    }

    get(key) {
        return this.statesToBytes.get(key);
    }

    getMany(keys) {
        return keys.map(key => this.get(key));
    }

    getbyCode(code) {
        if (code === 0) code = 1;

        return this.bytesToStates.get(code);
    }

    getByCodes(codes) {
        const result = [];

        for (const code of codes) { 
            const state = this.getbyCode(code);

            if (state) result.push(this.getbyCode(code));
        }

        return result;
    }
}

class ByteState {
    constructor(state = 0) {
        this.state = state;
    }

    or(state) {
        return new ByteState(this.state | state);
    }

    and(byteState) {
        return new ByteState(this.state & byteState.state);
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

    getStateBinary() {
        return this.state.toString(2);
    }

    getSize() {
        return this.getStateBinary().length;
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

    hasAny(adapter) {
        return this.byteState.and(adapter.byteState).state !== 0;
    }


    hasAnyMany(adapters) {
        return adapters.some(adapter => this.hasAny(adapter));
    }

    includesIn(adapter) { 
        return this.byteState.and(adapter.byteState).state === this.byteState.state;
    }

    getIntersection(adapter) { 
        const newState = this.byteState.and(adapter.byteState);
        const size = newState.getSize();
        const result = [];

        const { state } = newState;

        for (let i = 1; i <= state; i++) {
            const has = state & i;

            if (has) { 
                result.push(i);
            }
        }

        return this.byteCodes.getByCodes(result);
    }

    includesInMany(adapters) {
        return adapters.every(adapter => this.includesIn(adapter));
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
        return this.byteState.getStateBinary();
    }

    getSize() {
        return this.byteState.getSize();
    }
}
 

class ByteCompare {
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
