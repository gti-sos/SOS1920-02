
(function(l, r) { if (l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (window.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(window.document);
var app = (function () {
    'use strict';

    function noop() { }
    function assign(tar, src) {
        // @ts-ignore
        for (const k in src)
            tar[k] = src[k];
        return tar;
    }
    function is_promise(value) {
        return value && typeof value === 'object' && typeof value.then === 'function';
    }
    function add_location(element, file, line, column, char) {
        element.__svelte_meta = {
            loc: { file, line, column, char }
        };
    }
    function run(fn) {
        return fn();
    }
    function blank_object() {
        return Object.create(null);
    }
    function run_all(fns) {
        fns.forEach(run);
    }
    function is_function(thing) {
        return typeof thing === 'function';
    }
    function safe_not_equal(a, b) {
        return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
    }
    function validate_store(store, name) {
        if (store != null && typeof store.subscribe !== 'function') {
            throw new Error(`'${name}' is not a store with a 'subscribe' method`);
        }
    }
    function subscribe(store, ...callbacks) {
        if (store == null) {
            return noop;
        }
        const unsub = store.subscribe(...callbacks);
        return unsub.unsubscribe ? () => unsub.unsubscribe() : unsub;
    }
    function component_subscribe(component, store, callback) {
        component.$$.on_destroy.push(subscribe(store, callback));
    }
    function create_slot(definition, ctx, $$scope, fn) {
        if (definition) {
            const slot_ctx = get_slot_context(definition, ctx, $$scope, fn);
            return definition[0](slot_ctx);
        }
    }
    function get_slot_context(definition, ctx, $$scope, fn) {
        return definition[1] && fn
            ? assign($$scope.ctx.slice(), definition[1](fn(ctx)))
            : $$scope.ctx;
    }
    function get_slot_changes(definition, $$scope, dirty, fn) {
        if (definition[2] && fn) {
            const lets = definition[2](fn(dirty));
            if ($$scope.dirty === undefined) {
                return lets;
            }
            if (typeof lets === 'object') {
                const merged = [];
                const len = Math.max($$scope.dirty.length, lets.length);
                for (let i = 0; i < len; i += 1) {
                    merged[i] = $$scope.dirty[i] | lets[i];
                }
                return merged;
            }
            return $$scope.dirty | lets;
        }
        return $$scope.dirty;
    }
    function exclude_internal_props(props) {
        const result = {};
        for (const k in props)
            if (k[0] !== '$')
                result[k] = props[k];
        return result;
    }

    function append(target, node) {
        target.appendChild(node);
    }
    function insert(target, node, anchor) {
        target.insertBefore(node, anchor || null);
    }
    function detach(node) {
        node.parentNode.removeChild(node);
    }
    function destroy_each(iterations, detaching) {
        for (let i = 0; i < iterations.length; i += 1) {
            if (iterations[i])
                iterations[i].d(detaching);
        }
    }
    function element(name) {
        return document.createElement(name);
    }
    function text(data) {
        return document.createTextNode(data);
    }
    function space() {
        return text(' ');
    }
    function empty() {
        return text('');
    }
    function listen(node, event, handler, options) {
        node.addEventListener(event, handler, options);
        return () => node.removeEventListener(event, handler, options);
    }
    function attr(node, attribute, value) {
        if (value == null)
            node.removeAttribute(attribute);
        else if (node.getAttribute(attribute) !== value)
            node.setAttribute(attribute, value);
    }
    function set_attributes(node, attributes) {
        // @ts-ignore
        const descriptors = Object.getOwnPropertyDescriptors(node.__proto__);
        for (const key in attributes) {
            if (attributes[key] == null) {
                node.removeAttribute(key);
            }
            else if (key === 'style') {
                node.style.cssText = attributes[key];
            }
            else if (key === '__value' || descriptors[key] && descriptors[key].set) {
                node[key] = attributes[key];
            }
            else {
                attr(node, key, attributes[key]);
            }
        }
    }
    function to_number(value) {
        return value === '' ? undefined : +value;
    }
    function children(element) {
        return Array.from(element.childNodes);
    }
    function set_input_value(input, value) {
        if (value != null || input.value) {
            input.value = value;
        }
    }
    function set_style(node, key, value, important) {
        node.style.setProperty(key, value, important ? 'important' : '');
    }
    function select_option(select, value) {
        for (let i = 0; i < select.options.length; i += 1) {
            const option = select.options[i];
            if (option.__value === value) {
                option.selected = true;
                return;
            }
        }
    }
    function select_options(select, value) {
        for (let i = 0; i < select.options.length; i += 1) {
            const option = select.options[i];
            option.selected = ~value.indexOf(option.__value);
        }
    }
    function select_value(select) {
        const selected_option = select.querySelector(':checked') || select.options[0];
        return selected_option && selected_option.__value;
    }
    function select_multiple_value(select) {
        return [].map.call(select.querySelectorAll(':checked'), option => option.__value);
    }
    function custom_event(type, detail) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, false, false, detail);
        return e;
    }

    let current_component;
    function set_current_component(component) {
        current_component = component;
    }
    function get_current_component() {
        if (!current_component)
            throw new Error(`Function called outside component initialization`);
        return current_component;
    }
    function onMount(fn) {
        get_current_component().$$.on_mount.push(fn);
    }
    function createEventDispatcher() {
        const component = get_current_component();
        return (type, detail) => {
            const callbacks = component.$$.callbacks[type];
            if (callbacks) {
                // TODO are there situations where events could be dispatched
                // in a server (non-DOM) environment?
                const event = custom_event(type, detail);
                callbacks.slice().forEach(fn => {
                    fn.call(component, event);
                });
            }
        };
    }
    // TODO figure out if we still want to support
    // shorthand events, or if we want to implement
    // a real bubbling mechanism
    function bubble(component, event) {
        const callbacks = component.$$.callbacks[event.type];
        if (callbacks) {
            callbacks.slice().forEach(fn => fn(event));
        }
    }

    const dirty_components = [];
    const binding_callbacks = [];
    const render_callbacks = [];
    const flush_callbacks = [];
    const resolved_promise = Promise.resolve();
    let update_scheduled = false;
    function schedule_update() {
        if (!update_scheduled) {
            update_scheduled = true;
            resolved_promise.then(flush);
        }
    }
    function add_render_callback(fn) {
        render_callbacks.push(fn);
    }
    function add_flush_callback(fn) {
        flush_callbacks.push(fn);
    }
    let flushing = false;
    const seen_callbacks = new Set();
    function flush() {
        if (flushing)
            return;
        flushing = true;
        do {
            // first, call beforeUpdate functions
            // and update components
            for (let i = 0; i < dirty_components.length; i += 1) {
                const component = dirty_components[i];
                set_current_component(component);
                update(component.$$);
            }
            dirty_components.length = 0;
            while (binding_callbacks.length)
                binding_callbacks.pop()();
            // then, once components are updated, call
            // afterUpdate functions. This may cause
            // subsequent updates...
            for (let i = 0; i < render_callbacks.length; i += 1) {
                const callback = render_callbacks[i];
                if (!seen_callbacks.has(callback)) {
                    // ...so guard against infinite loops
                    seen_callbacks.add(callback);
                    callback();
                }
            }
            render_callbacks.length = 0;
        } while (dirty_components.length);
        while (flush_callbacks.length) {
            flush_callbacks.pop()();
        }
        update_scheduled = false;
        flushing = false;
        seen_callbacks.clear();
    }
    function update($$) {
        if ($$.fragment !== null) {
            $$.update();
            run_all($$.before_update);
            const dirty = $$.dirty;
            $$.dirty = [-1];
            $$.fragment && $$.fragment.p($$.ctx, dirty);
            $$.after_update.forEach(add_render_callback);
        }
    }
    const outroing = new Set();
    let outros;
    function group_outros() {
        outros = {
            r: 0,
            c: [],
            p: outros // parent group
        };
    }
    function check_outros() {
        if (!outros.r) {
            run_all(outros.c);
        }
        outros = outros.p;
    }
    function transition_in(block, local) {
        if (block && block.i) {
            outroing.delete(block);
            block.i(local);
        }
    }
    function transition_out(block, local, detach, callback) {
        if (block && block.o) {
            if (outroing.has(block))
                return;
            outroing.add(block);
            outros.c.push(() => {
                outroing.delete(block);
                if (callback) {
                    if (detach)
                        block.d(1);
                    callback();
                }
            });
            block.o(local);
        }
    }

    function handle_promise(promise, info) {
        const token = info.token = {};
        function update(type, index, key, value) {
            if (info.token !== token)
                return;
            info.resolved = value;
            let child_ctx = info.ctx;
            if (key !== undefined) {
                child_ctx = child_ctx.slice();
                child_ctx[key] = value;
            }
            const block = type && (info.current = type)(child_ctx);
            let needs_flush = false;
            if (info.block) {
                if (info.blocks) {
                    info.blocks.forEach((block, i) => {
                        if (i !== index && block) {
                            group_outros();
                            transition_out(block, 1, 1, () => {
                                info.blocks[i] = null;
                            });
                            check_outros();
                        }
                    });
                }
                else {
                    info.block.d(1);
                }
                block.c();
                transition_in(block, 1);
                block.m(info.mount(), info.anchor);
                needs_flush = true;
            }
            info.block = block;
            if (info.blocks)
                info.blocks[index] = block;
            if (needs_flush) {
                flush();
            }
        }
        if (is_promise(promise)) {
            const current_component = get_current_component();
            promise.then(value => {
                set_current_component(current_component);
                update(info.then, 1, info.value, value);
                set_current_component(null);
            }, error => {
                set_current_component(current_component);
                update(info.catch, 2, info.error, error);
                set_current_component(null);
            });
            // if we previously had a then/catch block, destroy it
            if (info.current !== info.pending) {
                update(info.pending, 0);
                return true;
            }
        }
        else {
            if (info.current !== info.then) {
                update(info.then, 1, info.value, promise);
                return true;
            }
            info.resolved = promise;
        }
    }

    const globals = (typeof window !== 'undefined'
        ? window
        : typeof globalThis !== 'undefined'
            ? globalThis
            : global);

    function get_spread_update(levels, updates) {
        const update = {};
        const to_null_out = {};
        const accounted_for = { $$scope: 1 };
        let i = levels.length;
        while (i--) {
            const o = levels[i];
            const n = updates[i];
            if (n) {
                for (const key in o) {
                    if (!(key in n))
                        to_null_out[key] = 1;
                }
                for (const key in n) {
                    if (!accounted_for[key]) {
                        update[key] = n[key];
                        accounted_for[key] = 1;
                    }
                }
                levels[i] = n;
            }
            else {
                for (const key in o) {
                    accounted_for[key] = 1;
                }
            }
        }
        for (const key in to_null_out) {
            if (!(key in update))
                update[key] = undefined;
        }
        return update;
    }

    function bind(component, name, callback) {
        const index = component.$$.props[name];
        if (index !== undefined) {
            component.$$.bound[index] = callback;
            callback(component.$$.ctx[index]);
        }
    }
    function create_component(block) {
        block && block.c();
    }
    function mount_component(component, target, anchor) {
        const { fragment, on_mount, on_destroy, after_update } = component.$$;
        fragment && fragment.m(target, anchor);
        // onMount happens before the initial afterUpdate
        add_render_callback(() => {
            const new_on_destroy = on_mount.map(run).filter(is_function);
            if (on_destroy) {
                on_destroy.push(...new_on_destroy);
            }
            else {
                // Edge case - component was destroyed immediately,
                // most likely as a result of a binding initialising
                run_all(new_on_destroy);
            }
            component.$$.on_mount = [];
        });
        after_update.forEach(add_render_callback);
    }
    function destroy_component(component, detaching) {
        const $$ = component.$$;
        if ($$.fragment !== null) {
            run_all($$.on_destroy);
            $$.fragment && $$.fragment.d(detaching);
            // TODO null out other refs, including component.$$ (but need to
            // preserve final state?)
            $$.on_destroy = $$.fragment = null;
            $$.ctx = [];
        }
    }
    function make_dirty(component, i) {
        if (component.$$.dirty[0] === -1) {
            dirty_components.push(component);
            schedule_update();
            component.$$.dirty.fill(0);
        }
        component.$$.dirty[(i / 31) | 0] |= (1 << (i % 31));
    }
    function init(component, options, instance, create_fragment, not_equal, props, dirty = [-1]) {
        const parent_component = current_component;
        set_current_component(component);
        const prop_values = options.props || {};
        const $$ = component.$$ = {
            fragment: null,
            ctx: null,
            // state
            props,
            update: noop,
            not_equal,
            bound: blank_object(),
            // lifecycle
            on_mount: [],
            on_destroy: [],
            before_update: [],
            after_update: [],
            context: new Map(parent_component ? parent_component.$$.context : []),
            // everything else
            callbacks: blank_object(),
            dirty
        };
        let ready = false;
        $$.ctx = instance
            ? instance(component, prop_values, (i, ret, ...rest) => {
                const value = rest.length ? rest[0] : ret;
                if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
                    if ($$.bound[i])
                        $$.bound[i](value);
                    if (ready)
                        make_dirty(component, i);
                }
                return ret;
            })
            : [];
        $$.update();
        ready = true;
        run_all($$.before_update);
        // `false` as a special case of no DOM component
        $$.fragment = create_fragment ? create_fragment($$.ctx) : false;
        if (options.target) {
            if (options.hydrate) {
                const nodes = children(options.target);
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.l(nodes);
                nodes.forEach(detach);
            }
            else {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.c();
            }
            if (options.intro)
                transition_in(component.$$.fragment);
            mount_component(component, options.target, options.anchor);
            flush();
        }
        set_current_component(parent_component);
    }
    class SvelteComponent {
        $destroy() {
            destroy_component(this, 1);
            this.$destroy = noop;
        }
        $on(type, callback) {
            const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
            callbacks.push(callback);
            return () => {
                const index = callbacks.indexOf(callback);
                if (index !== -1)
                    callbacks.splice(index, 1);
            };
        }
        $set() {
            // overridden by instance, if it has props
        }
    }

    function dispatch_dev(type, detail) {
        document.dispatchEvent(custom_event(type, Object.assign({ version: '3.21.0' }, detail)));
    }
    function append_dev(target, node) {
        dispatch_dev("SvelteDOMInsert", { target, node });
        append(target, node);
    }
    function insert_dev(target, node, anchor) {
        dispatch_dev("SvelteDOMInsert", { target, node, anchor });
        insert(target, node, anchor);
    }
    function detach_dev(node) {
        dispatch_dev("SvelteDOMRemove", { node });
        detach(node);
    }
    function listen_dev(node, event, handler, options, has_prevent_default, has_stop_propagation) {
        const modifiers = options === true ? ["capture"] : options ? Array.from(Object.keys(options)) : [];
        if (has_prevent_default)
            modifiers.push('preventDefault');
        if (has_stop_propagation)
            modifiers.push('stopPropagation');
        dispatch_dev("SvelteDOMAddEventListener", { node, event, handler, modifiers });
        const dispose = listen(node, event, handler, options);
        return () => {
            dispatch_dev("SvelteDOMRemoveEventListener", { node, event, handler, modifiers });
            dispose();
        };
    }
    function attr_dev(node, attribute, value) {
        attr(node, attribute, value);
        if (value == null)
            dispatch_dev("SvelteDOMRemoveAttribute", { node, attribute });
        else
            dispatch_dev("SvelteDOMSetAttribute", { node, attribute, value });
    }
    function set_data_dev(text, data) {
        data = '' + data;
        if (text.data === data)
            return;
        dispatch_dev("SvelteDOMSetData", { node: text, data });
        text.data = data;
    }
    function validate_each_argument(arg) {
        if (typeof arg !== 'string' && !(arg && typeof arg === 'object' && 'length' in arg)) {
            let msg = '{#each} only iterates over array-like objects.';
            if (typeof Symbol === 'function' && arg && Symbol.iterator in arg) {
                msg += ' You can use a spread to convert this iterable into an array.';
            }
            throw new Error(msg);
        }
    }
    function validate_slots(name, slot, keys) {
        for (const slot_key of Object.keys(slot)) {
            if (!~keys.indexOf(slot_key)) {
                console.warn(`<${name}> received an unexpected slot "${slot_key}".`);
            }
        }
    }
    class SvelteComponentDev extends SvelteComponent {
        constructor(options) {
            if (!options || (!options.target && !options.$$inline)) {
                throw new Error(`'target' is a required option`);
            }
            super();
        }
        $destroy() {
            super.$destroy();
            this.$destroy = () => {
                console.warn(`Component was already destroyed`); // eslint-disable-line no-console
            };
        }
        $capture_state() { }
        $inject_state() { }
    }

    const subscriber_queue = [];
    /**
     * Creates a `Readable` store that allows reading by subscription.
     * @param value initial value
     * @param {StartStopNotifier}start start and stop notifications for subscriptions
     */
    function readable(value, start) {
        return {
            subscribe: writable(value, start).subscribe,
        };
    }
    /**
     * Create a `Writable` store that allows both updating and reading by subscription.
     * @param {*=}value initial value
     * @param {StartStopNotifier=}start start and stop notifications for subscriptions
     */
    function writable(value, start = noop) {
        let stop;
        const subscribers = [];
        function set(new_value) {
            if (safe_not_equal(value, new_value)) {
                value = new_value;
                if (stop) { // store is ready
                    const run_queue = !subscriber_queue.length;
                    for (let i = 0; i < subscribers.length; i += 1) {
                        const s = subscribers[i];
                        s[1]();
                        subscriber_queue.push(s, value);
                    }
                    if (run_queue) {
                        for (let i = 0; i < subscriber_queue.length; i += 2) {
                            subscriber_queue[i][0](subscriber_queue[i + 1]);
                        }
                        subscriber_queue.length = 0;
                    }
                }
            }
        }
        function update(fn) {
            set(fn(value));
        }
        function subscribe(run, invalidate = noop) {
            const subscriber = [run, invalidate];
            subscribers.push(subscriber);
            if (subscribers.length === 1) {
                stop = start(set) || noop;
            }
            run(value);
            return () => {
                const index = subscribers.indexOf(subscriber);
                if (index !== -1) {
                    subscribers.splice(index, 1);
                }
                if (subscribers.length === 0) {
                    stop();
                    stop = null;
                }
            };
        }
        return { set, update, subscribe };
    }
    function derived(stores, fn, initial_value) {
        const single = !Array.isArray(stores);
        const stores_array = single
            ? [stores]
            : stores;
        const auto = fn.length < 2;
        return readable(initial_value, (set) => {
            let inited = false;
            const values = [];
            let pending = 0;
            let cleanup = noop;
            const sync = () => {
                if (pending) {
                    return;
                }
                cleanup();
                const result = fn(single ? values[0] : values, set);
                if (auto) {
                    set(result);
                }
                else {
                    cleanup = is_function(result) ? result : noop;
                }
            };
            const unsubscribers = stores_array.map((store, i) => subscribe(store, (value) => {
                values[i] = value;
                pending &= ~(1 << i);
                if (inited) {
                    sync();
                }
            }, () => {
                pending |= (1 << i);
            }));
            inited = true;
            sync();
            return function stop() {
                run_all(unsubscribers);
                cleanup();
            };
        });
    }

    function regexparam (str, loose) {
    	if (str instanceof RegExp) return { keys:false, pattern:str };
    	var c, o, tmp, ext, keys=[], pattern='', arr = str.split('/');
    	arr[0] || arr.shift();

    	while (tmp = arr.shift()) {
    		c = tmp[0];
    		if (c === '*') {
    			keys.push('wild');
    			pattern += '/(.*)';
    		} else if (c === ':') {
    			o = tmp.indexOf('?', 1);
    			ext = tmp.indexOf('.', 1);
    			keys.push( tmp.substring(1, !!~o ? o : !!~ext ? ext : tmp.length) );
    			pattern += !!~o && !~ext ? '(?:/([^/]+?))?' : '/([^/]+?)';
    			if (!!~ext) pattern += (!!~o ? '?' : '') + '\\' + tmp.substring(ext);
    		} else {
    			pattern += '/' + tmp;
    		}
    	}

    	return {
    		keys: keys,
    		pattern: new RegExp('^' + pattern + (loose ? '(?=$|\/)' : '\/?$'), 'i')
    	};
    }

    /* node_modules\svelte-spa-router\Router.svelte generated by Svelte v3.21.0 */

    const { Error: Error_1, Object: Object_1, console: console_1 } = globals;

    // (209:0) {:else}
    function create_else_block(ctx) {
    	let switch_instance_anchor;
    	let current;
    	var switch_value = /*component*/ ctx[0];

    	function switch_props(ctx) {
    		return { $$inline: true };
    	}

    	if (switch_value) {
    		var switch_instance = new switch_value(switch_props());
    		switch_instance.$on("routeEvent", /*routeEvent_handler_1*/ ctx[10]);
    	}

    	const block = {
    		c: function create() {
    			if (switch_instance) create_component(switch_instance.$$.fragment);
    			switch_instance_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if (switch_instance) {
    				mount_component(switch_instance, target, anchor);
    			}

    			insert_dev(target, switch_instance_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (switch_value !== (switch_value = /*component*/ ctx[0])) {
    				if (switch_instance) {
    					group_outros();
    					const old_component = switch_instance;

    					transition_out(old_component.$$.fragment, 1, 0, () => {
    						destroy_component(old_component, 1);
    					});

    					check_outros();
    				}

    				if (switch_value) {
    					switch_instance = new switch_value(switch_props());
    					switch_instance.$on("routeEvent", /*routeEvent_handler_1*/ ctx[10]);
    					create_component(switch_instance.$$.fragment);
    					transition_in(switch_instance.$$.fragment, 1);
    					mount_component(switch_instance, switch_instance_anchor.parentNode, switch_instance_anchor);
    				} else {
    					switch_instance = null;
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			if (switch_instance) transition_in(switch_instance.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			if (switch_instance) transition_out(switch_instance.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(switch_instance_anchor);
    			if (switch_instance) destroy_component(switch_instance, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block.name,
    		type: "else",
    		source: "(209:0) {:else}",
    		ctx
    	});

    	return block;
    }

    // (207:0) {#if componentParams}
    function create_if_block(ctx) {
    	let switch_instance_anchor;
    	let current;
    	var switch_value = /*component*/ ctx[0];

    	function switch_props(ctx) {
    		return {
    			props: { params: /*componentParams*/ ctx[1] },
    			$$inline: true
    		};
    	}

    	if (switch_value) {
    		var switch_instance = new switch_value(switch_props(ctx));
    		switch_instance.$on("routeEvent", /*routeEvent_handler*/ ctx[9]);
    	}

    	const block = {
    		c: function create() {
    			if (switch_instance) create_component(switch_instance.$$.fragment);
    			switch_instance_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if (switch_instance) {
    				mount_component(switch_instance, target, anchor);
    			}

    			insert_dev(target, switch_instance_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const switch_instance_changes = {};
    			if (dirty & /*componentParams*/ 2) switch_instance_changes.params = /*componentParams*/ ctx[1];

    			if (switch_value !== (switch_value = /*component*/ ctx[0])) {
    				if (switch_instance) {
    					group_outros();
    					const old_component = switch_instance;

    					transition_out(old_component.$$.fragment, 1, 0, () => {
    						destroy_component(old_component, 1);
    					});

    					check_outros();
    				}

    				if (switch_value) {
    					switch_instance = new switch_value(switch_props(ctx));
    					switch_instance.$on("routeEvent", /*routeEvent_handler*/ ctx[9]);
    					create_component(switch_instance.$$.fragment);
    					transition_in(switch_instance.$$.fragment, 1);
    					mount_component(switch_instance, switch_instance_anchor.parentNode, switch_instance_anchor);
    				} else {
    					switch_instance = null;
    				}
    			} else if (switch_value) {
    				switch_instance.$set(switch_instance_changes);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			if (switch_instance) transition_in(switch_instance.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			if (switch_instance) transition_out(switch_instance.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(switch_instance_anchor);
    			if (switch_instance) destroy_component(switch_instance, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block.name,
    		type: "if",
    		source: "(207:0) {#if componentParams}",
    		ctx
    	});

    	return block;
    }

    function create_fragment(ctx) {
    	let current_block_type_index;
    	let if_block;
    	let if_block_anchor;
    	let current;
    	const if_block_creators = [create_if_block, create_else_block];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*componentParams*/ ctx[1]) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error_1("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if_blocks[current_block_type_index].m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				}

    				transition_in(if_block, 1);
    				if_block.m(if_block_anchor.parentNode, if_block_anchor);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if_blocks[current_block_type_index].d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function wrap(route, userData, ...conditions) {
    	// Check if we don't have userData
    	if (userData && typeof userData == "function") {
    		conditions = conditions && conditions.length ? conditions : [];
    		conditions.unshift(userData);
    		userData = undefined;
    	}

    	// Parameter route and each item of conditions must be functions
    	if (!route || typeof route != "function") {
    		throw Error("Invalid parameter route");
    	}

    	if (conditions && conditions.length) {
    		for (let i = 0; i < conditions.length; i++) {
    			if (!conditions[i] || typeof conditions[i] != "function") {
    				throw Error("Invalid parameter conditions[" + i + "]");
    			}
    		}
    	}

    	// Returns an object that contains all the functions to execute too
    	const obj = { route, userData };

    	if (conditions && conditions.length) {
    		obj.conditions = conditions;
    	}

    	// The _sveltesparouter flag is to confirm the object was created by this router
    	Object.defineProperty(obj, "_sveltesparouter", { value: true });

    	return obj;
    }

    /**
     * @typedef {Object} Location
     * @property {string} location - Location (page/view), for example `/book`
     * @property {string} [querystring] - Querystring from the hash, as a string not parsed
     */
    /**
     * Returns the current location from the hash.
     *
     * @returns {Location} Location object
     * @private
     */
    function getLocation() {
    	const hashPosition = window.location.href.indexOf("#/");

    	let location = hashPosition > -1
    	? window.location.href.substr(hashPosition + 1)
    	: "/";

    	// Check if there's a querystring
    	const qsPosition = location.indexOf("?");

    	let querystring = "";

    	if (qsPosition > -1) {
    		querystring = location.substr(qsPosition + 1);
    		location = location.substr(0, qsPosition);
    	}

    	return { location, querystring };
    }

    const loc = readable(getLocation(), // eslint-disable-next-line prefer-arrow-callback
    function start(set) {
    	const update = () => {
    		set(getLocation());
    	};

    	window.addEventListener("hashchange", update, false);

    	return function stop() {
    		window.removeEventListener("hashchange", update, false);
    	};
    });

    const location = derived(loc, $loc => $loc.location);
    const querystring = derived(loc, $loc => $loc.querystring);

    function push(location) {
    	if (!location || location.length < 1 || location.charAt(0) != "/" && location.indexOf("#/") !== 0) {
    		throw Error("Invalid parameter location");
    	}

    	// Execute this code when the current call stack is complete
    	return nextTickPromise(() => {
    		window.location.hash = (location.charAt(0) == "#" ? "" : "#") + location;
    	});
    }

    function pop() {
    	// Execute this code when the current call stack is complete
    	return nextTickPromise(() => {
    		window.history.back();
    	});
    }

    function replace(location) {
    	if (!location || location.length < 1 || location.charAt(0) != "/" && location.indexOf("#/") !== 0) {
    		throw Error("Invalid parameter location");
    	}

    	// Execute this code when the current call stack is complete
    	return nextTickPromise(() => {
    		const dest = (location.charAt(0) == "#" ? "" : "#") + location;

    		try {
    			window.history.replaceState(undefined, undefined, dest);
    		} catch(e) {
    			// eslint-disable-next-line no-console
    			console.warn("Caught exception while replacing the current page. If you're running this in the Svelte REPL, please note that the `replace` method might not work in this environment.");
    		}

    		// The method above doesn't trigger the hashchange event, so let's do that manually
    		window.dispatchEvent(new Event("hashchange"));
    	});
    }

    function link(node) {
    	// Only apply to <a> tags
    	if (!node || !node.tagName || node.tagName.toLowerCase() != "a") {
    		throw Error("Action \"link\" can only be used with <a> tags");
    	}

    	// Destination must start with '/'
    	const href = node.getAttribute("href");

    	if (!href || href.length < 1 || href.charAt(0) != "/") {
    		throw Error("Invalid value for \"href\" attribute");
    	}

    	// Add # to every href attribute
    	node.setAttribute("href", "#" + href);
    }

    function nextTickPromise(cb) {
    	return new Promise(resolve => {
    			setTimeout(
    				() => {
    					resolve(cb());
    				},
    				0
    			);
    		});
    }

    function instance($$self, $$props, $$invalidate) {
    	let $loc,
    		$$unsubscribe_loc = noop;

    	validate_store(loc, "loc");
    	component_subscribe($$self, loc, $$value => $$invalidate(4, $loc = $$value));
    	$$self.$$.on_destroy.push(() => $$unsubscribe_loc());
    	let { routes = {} } = $$props;
    	let { prefix = "" } = $$props;

    	/**
     * Container for a route: path, component
     */
    	class RouteItem {
    		/**
     * Initializes the object and creates a regular expression from the path, using regexparam.
     *
     * @param {string} path - Path to the route (must start with '/' or '*')
     * @param {SvelteComponent} component - Svelte component for the route
     */
    		constructor(path, component) {
    			if (!component || typeof component != "function" && (typeof component != "object" || component._sveltesparouter !== true)) {
    				throw Error("Invalid component object");
    			}

    			// Path must be a regular or expression, or a string starting with '/' or '*'
    			if (!path || typeof path == "string" && (path.length < 1 || path.charAt(0) != "/" && path.charAt(0) != "*") || typeof path == "object" && !(path instanceof RegExp)) {
    				throw Error("Invalid value for \"path\" argument");
    			}

    			const { pattern, keys } = regexparam(path);
    			this.path = path;

    			// Check if the component is wrapped and we have conditions
    			if (typeof component == "object" && component._sveltesparouter === true) {
    				this.component = component.route;
    				this.conditions = component.conditions || [];
    				this.userData = component.userData;
    			} else {
    				this.component = component;
    				this.conditions = [];
    				this.userData = undefined;
    			}

    			this._pattern = pattern;
    			this._keys = keys;
    		}

    		/**
     * Checks if `path` matches the current route.
     * If there's a match, will return the list of parameters from the URL (if any).
     * In case of no match, the method will return `null`.
     *
     * @param {string} path - Path to test
     * @returns {null|Object.<string, string>} List of paramters from the URL if there's a match, or `null` otherwise.
     */
    		match(path) {
    			// If there's a prefix, remove it before we run the matching
    			if (prefix && path.startsWith(prefix)) {
    				path = path.substr(prefix.length) || "/";
    			}

    			// Check if the pattern matches
    			const matches = this._pattern.exec(path);

    			if (matches === null) {
    				return null;
    			}

    			// If the input was a regular expression, this._keys would be false, so return matches as is
    			if (this._keys === false) {
    				return matches;
    			}

    			const out = {};
    			let i = 0;

    			while (i < this._keys.length) {
    				out[this._keys[i]] = matches[++i] || null;
    			}

    			return out;
    		}

    		/**
     * Dictionary with route details passed to the pre-conditions functions, as well as the `routeLoaded` and `conditionsFailed` events
     * @typedef {Object} RouteDetail
     * @property {SvelteComponent} component - Svelte component
     * @property {string} name - Name of the Svelte component
     * @property {string} location - Location path
     * @property {string} querystring - Querystring from the hash
     * @property {Object} [userData] - Custom data passed by the user
     */
    		/**
     * Executes all conditions (if any) to control whether the route can be shown. Conditions are executed in the order they are defined, and if a condition fails, the following ones aren't executed.
     * 
     * @param {RouteDetail} detail - Route detail
     * @returns {bool} Returns true if all the conditions succeeded
     */
    		checkConditions(detail) {
    			for (let i = 0; i < this.conditions.length; i++) {
    				if (!this.conditions[i](detail)) {
    					return false;
    				}
    			}

    			return true;
    		}
    	}

    	// Set up all routes
    	const routesList = [];

    	if (routes instanceof Map) {
    		// If it's a map, iterate on it right away
    		routes.forEach((route, path) => {
    			routesList.push(new RouteItem(path, route));
    		});
    	} else {
    		// We have an object, so iterate on its own properties
    		Object.keys(routes).forEach(path => {
    			routesList.push(new RouteItem(path, routes[path]));
    		});
    	}

    	// Props for the component to render
    	let component = null;

    	let componentParams = null;

    	// Event dispatcher from Svelte
    	const dispatch = createEventDispatcher();

    	// Just like dispatch, but executes on the next iteration of the event loop
    	const dispatchNextTick = (name, detail) => {
    		// Execute this code when the current call stack is complete
    		setTimeout(
    			() => {
    				dispatch(name, detail);
    			},
    			0
    		);
    	};

    	const writable_props = ["routes", "prefix"];

    	Object_1.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console_1.warn(`<Router> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("Router", $$slots, []);

    	function routeEvent_handler(event) {
    		bubble($$self, event);
    	}

    	function routeEvent_handler_1(event) {
    		bubble($$self, event);
    	}

    	$$self.$set = $$props => {
    		if ("routes" in $$props) $$invalidate(2, routes = $$props.routes);
    		if ("prefix" in $$props) $$invalidate(3, prefix = $$props.prefix);
    	};

    	$$self.$capture_state = () => ({
    		readable,
    		derived,
    		wrap,
    		getLocation,
    		loc,
    		location,
    		querystring,
    		push,
    		pop,
    		replace,
    		link,
    		nextTickPromise,
    		createEventDispatcher,
    		regexparam,
    		routes,
    		prefix,
    		RouteItem,
    		routesList,
    		component,
    		componentParams,
    		dispatch,
    		dispatchNextTick,
    		$loc
    	});

    	$$self.$inject_state = $$props => {
    		if ("routes" in $$props) $$invalidate(2, routes = $$props.routes);
    		if ("prefix" in $$props) $$invalidate(3, prefix = $$props.prefix);
    		if ("component" in $$props) $$invalidate(0, component = $$props.component);
    		if ("componentParams" in $$props) $$invalidate(1, componentParams = $$props.componentParams);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*component, $loc*/ 17) {
    			// Handle hash change events
    			// Listen to changes in the $loc store and update the page
    			 {
    				// Find a route matching the location
    				$$invalidate(0, component = null);

    				let i = 0;

    				while (!component && i < routesList.length) {
    					const match = routesList[i].match($loc.location);

    					if (match) {
    						const detail = {
    							component: routesList[i].component,
    							name: routesList[i].component.name,
    							location: $loc.location,
    							querystring: $loc.querystring,
    							userData: routesList[i].userData
    						};

    						// Check if the route can be loaded - if all conditions succeed
    						if (!routesList[i].checkConditions(detail)) {
    							// Trigger an event to notify the user
    							dispatchNextTick("conditionsFailed", detail);

    							break;
    						}

    						$$invalidate(0, component = routesList[i].component);

    						// Set componentParams onloy if we have a match, to avoid a warning similar to `<Component> was created with unknown prop 'params'`
    						// Of course, this assumes that developers always add a "params" prop when they are expecting parameters
    						if (match && typeof match == "object" && Object.keys(match).length) {
    							$$invalidate(1, componentParams = match);
    						} else {
    							$$invalidate(1, componentParams = null);
    						}

    						dispatchNextTick("routeLoaded", detail);
    					}

    					i++;
    				}
    			}
    		}
    	};

    	return [
    		component,
    		componentParams,
    		routes,
    		prefix,
    		$loc,
    		RouteItem,
    		routesList,
    		dispatch,
    		dispatchNextTick,
    		routeEvent_handler,
    		routeEvent_handler_1
    	];
    }

    class Router extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance, create_fragment, safe_not_equal, { routes: 2, prefix: 3 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Router",
    			options,
    			id: create_fragment.name
    		});
    	}

    	get routes() {
    		throw new Error_1("<Router>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set routes(value) {
    		throw new Error_1("<Router>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get prefix() {
    		throw new Error_1("<Router>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set prefix(value) {
    		throw new Error_1("<Router>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\front\NotFound.svelte generated by Svelte v3.21.0 */

    const file = "src\\front\\NotFound.svelte";

    function create_fragment$1(ctx) {
    	let main;
    	let h1;

    	const block = {
    		c: function create() {
    			main = element("main");
    			h1 = element("h1");
    			h1.textContent = "La pagina no existe!";
    			add_location(h1, file, 1, 4, 12);
    			add_location(main, file, 0, 0, 0);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			append_dev(main, h1);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$1.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$1($$self, $$props) {
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<NotFound> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("NotFound", $$slots, []);
    	return [];
    }

    class NotFound extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$1, create_fragment$1, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "NotFound",
    			options,
    			id: create_fragment$1.name
    		});
    	}
    }

    /* src\front\Home.svelte generated by Svelte v3.21.0 */

    const file$1 = "src\\front\\Home.svelte";

    function create_fragment$2(ctx) {
    	let main;
    	let div1;
    	let div0;
    	let br0;
    	let t0;
    	let ul2;
    	let li0;
    	let strong0;
    	let t2;
    	let ul0;
    	let li1;
    	let a0;
    	let t4;
    	let li2;
    	let a1;
    	let t6;
    	let li3;
    	let a2;
    	let t8;
    	let li4;
    	let strong1;
    	let t10;
    	let t11;
    	let li5;
    	let strong2;
    	let a3;
    	let t14;
    	let li6;
    	let strong3;
    	let a4;
    	let t17;
    	let li7;
    	let strong4;
    	let a5;
    	let t20;
    	let li8;
    	let strong5;
    	let t22;
    	let ul1;
    	let li9;
    	let a6;
    	let t24;
    	let a7;
    	let t26;
    	let t27;
    	let li10;
    	let a8;
    	let t29;
    	let a9;
    	let t31;
    	let t32;
    	let li11;
    	let a10;
    	let t34;
    	let a11;
    	let t36;
    	let t37;
    	let li12;
    	let a12;
    	let t39;
    	let a13;
    	let t41;
    	let t42;
    	let li13;
    	let a14;
    	let t44;
    	let a15;
    	let t46;
    	let t47;
    	let li14;
    	let a16;
    	let t49;
    	let a17;
    	let t51;
    	let t52;
    	let br1;
    	let t53;
    	let button0;
    	let t55;
    	let button1;
    	let t57;
    	let button2;
    	let br2;
    	let br3;
    	let t59;
    	let button3;
    	let t61;
    	let button4;
    	let t63;
    	let button5;
    	let br4;
    	let br5;
    	let t65;
    	let button6;
    	let t67;
    	let button7;
    	let t69;
    	let button8;
    	let br6;
    	let br7;
    	let t71;
    	let button9;
    	let t73;
    	let button10;
    	let t75;
    	let br8;

    	const block = {
    		c: function create() {
    			main = element("main");
    			div1 = element("div");
    			div0 = element("div");
    			br0 = element("br");
    			t0 = space();
    			ul2 = element("ul");
    			li0 = element("li");
    			strong0 = element("strong");
    			strong0.textContent = "Team:";
    			t2 = space();
    			ul0 = element("ul");
    			li1 = element("li");
    			a0 = element("a");
    			a0.textContent = "Ana Fraire González";
    			t4 = space();
    			li2 = element("li");
    			a1 = element("a");
    			a1.textContent = "José Francisco Morales Ruiz";
    			t6 = space();
    			li3 = element("li");
    			a2 = element("a");
    			a2.textContent = "Marta Verdugo Martínez";
    			t8 = space();
    			li4 = element("li");
    			strong1 = element("strong");
    			strong1.textContent = "Project description: ";
    			t10 = text("Analysis of the relationship between the traffic accidents, rural tourism and evolution of\r\n\t\t\t\t\tcycling routes");
    			t11 = space();
    			li5 = element("li");
    			strong2 = element("strong");
    			strong2.textContent = "Repository: ";
    			a3 = element("a");
    			a3.textContent = "gti-sos/SOS1920-02";
    			t14 = space();
    			li6 = element("li");
    			strong3 = element("strong");
    			strong3.textContent = "URL HEROKU: ";
    			a4 = element("a");
    			a4.textContent = "http://sos1920-02.herokuapp.com";
    			t17 = space();
    			li7 = element("li");
    			strong4 = element("strong");
    			strong4.textContent = "URL AZURE: ";
    			a5 = element("a");
    			a5.textContent = "https://sos1920-02.azurewebsites.net/";
    			t20 = space();
    			li8 = element("li");
    			strong5 = element("strong");
    			strong5.textContent = "APIs:";
    			t22 = space();
    			ul1 = element("ul");
    			li9 = element("li");
    			a6 = element("a");
    			a6.textContent = "https://sos1920-02.herokuapp.com/api/v1/evolution-of-cycling-routes";
    			t24 = text(" (developed by ");
    			a7 = element("a");
    			a7.textContent = "Ana\r\n\t\t\t\t\t\tFraire Gonzalez";
    			t26 = text(")");
    			t27 = space();
    			li10 = element("li");
    			a8 = element("a");
    			a8.textContent = "https://sos1920-02.herokuapp.com/api/v2/evolution-of-cycling-routes";
    			t29 = text(" (developed by ");
    			a9 = element("a");
    			a9.textContent = "Ana\r\n\t\t\t\t\t\tFraire Gonzalez";
    			t31 = text(")");
    			t32 = space();
    			li11 = element("li");
    			a10 = element("a");
    			a10.textContent = "https://sos1920-02.herokuapp.com/api/v1/traffic-accidents";
    			t34 = text(" (developed by ");
    			a11 = element("a");
    			a11.textContent = "Jose\r\n\t\t\t\t\t\tFrancisco Morales Ruiz";
    			t36 = text(")");
    			t37 = space();
    			li12 = element("li");
    			a12 = element("a");
    			a12.textContent = "https://sos1920-02.herokuapp.com/api/v2/traffic-accidents";
    			t39 = text(" (developed by ");
    			a13 = element("a");
    			a13.textContent = "Jose\r\n\t\t\t\t\t\tFrancisco Morales Ruiz";
    			t41 = text(")");
    			t42 = space();
    			li13 = element("li");
    			a14 = element("a");
    			a14.textContent = "https://sos1920-02.herokuapp.com/api/v1/rural-tourism-stats";
    			t44 = text(" (developed by ");
    			a15 = element("a");
    			a15.textContent = "Marta Verdugo Martinez";
    			t46 = text(")");
    			t47 = space();
    			li14 = element("li");
    			a16 = element("a");
    			a16.textContent = "https://sos1920-02.herokuapp.com/api/v2/rural-tourism-stats";
    			t49 = text(" (developed by ");
    			a17 = element("a");
    			a17.textContent = "Marta Verdugo Martinez";
    			t51 = text(")");
    			t52 = space();
    			br1 = element("br");
    			t53 = space();
    			button0 = element("button");
    			button0.textContent = "API Evolucion Carriles Bici";
    			t55 = space();
    			button1 = element("button");
    			button1.textContent = "API Turismo Rural";
    			t57 = space();
    			button2 = element("button");
    			button2.textContent = "API Accidentes De Tráfico ";
    			br2 = element("br");
    			br3 = element("br");
    			t59 = space();
    			button3 = element("button");
    			button3.textContent = "Estadísticas Evolucion Carriles Bici";
    			t61 = space();
    			button4 = element("button");
    			button4.textContent = "Estadísticas Turismo Rural";
    			t63 = space();
    			button5 = element("button");
    			button5.textContent = "Estadísticas Accidentes Tráfico";
    			br4 = element("br");
    			br5 = element("br");
    			t65 = space();
    			button6 = element("button");
    			button6.textContent = "Estadísticas Evolucion Carriles Bici";
    			t67 = space();
    			button7 = element("button");
    			button7.textContent = "Estadísticas Turismo Rural";
    			t69 = space();
    			button8 = element("button");
    			button8.textContent = "Gráfica Accidentes";
    			br6 = element("br");
    			br7 = element("br");
    			t71 = space();
    			button9 = element("button");
    			button9.textContent = "Analysis";
    			t73 = space();
    			button10 = element("button");
    			button10.textContent = "Integraciones";
    			t75 = space();
    			br8 = element("br");
    			add_location(br0, file$1, 4, 3, 75);
    			add_location(strong0, file$1, 6, 8, 98);
    			add_location(li0, file$1, 6, 4, 94);
    			attr_dev(a0, "href", "https://github.com/anafraire");
    			add_location(a0, file$1, 8, 9, 147);
    			add_location(li1, file$1, 8, 5, 143);
    			attr_dev(a1, "href", "https://github.com/josmorrui2");
    			add_location(a1, file$1, 9, 9, 225);
    			add_location(li2, file$1, 9, 5, 221);
    			attr_dev(a2, "href", "https://github.com/martaverdugo6");
    			add_location(a2, file$1, 10, 9, 312);
    			add_location(li3, file$1, 10, 5, 308);
    			add_location(ul0, file$1, 7, 4, 132);
    			add_location(strong1, file$1, 12, 8, 407);
    			add_location(li4, file$1, 12, 4, 403);
    			add_location(strong2, file$1, 14, 8, 572);
    			attr_dev(a3, "href", "https://github.com/gti-sos/SOS1920-02");
    			add_location(a3, file$1, 14, 37, 601);
    			add_location(li5, file$1, 14, 4, 568);
    			add_location(strong3, file$1, 15, 8, 686);
    			attr_dev(a4, "href", "http://sos1920-02.herokuapp.com");
    			add_location(a4, file$1, 15, 37, 715);
    			add_location(li6, file$1, 15, 4, 682);
    			add_location(strong4, file$1, 16, 8, 807);
    			attr_dev(a5, "href", "https://sos1920-02.azurewebsites.net/");
    			add_location(a5, file$1, 16, 36, 835);
    			add_location(li7, file$1, 16, 4, 803);
    			add_location(strong5, file$1, 17, 8, 939);
    			add_location(li8, file$1, 17, 4, 935);
    			attr_dev(a6, "href", "https://documenter.getpostman.com/view/10637431/SzezcrsS");
    			add_location(a6, file$1, 19, 9, 988);
    			attr_dev(a7, "href", "https://github.com/anafraire");
    			add_location(a7, file$1, 19, 162, 1141);
    			add_location(li9, file$1, 19, 5, 984);
    			attr_dev(a8, "href", "https://documenter.getpostman.com/view/10637431/Szmcaz3h");
    			add_location(a8, file$1, 21, 9, 1227);
    			attr_dev(a9, "href", "https://github.com/anafraire");
    			add_location(a9, file$1, 21, 162, 1380);
    			add_location(li10, file$1, 21, 5, 1223);
    			attr_dev(a10, "href", "https://documenter.getpostman.com/view/10653459/SzYT6hqm");
    			add_location(a10, file$1, 23, 9, 1466);
    			attr_dev(a11, "href", "https://github.com/josmorrui2");
    			add_location(a11, file$1, 23, 152, 1609);
    			add_location(li11, file$1, 23, 5, 1462);
    			attr_dev(a12, "href", "https://documenter.getpostman.com/view/10653459/SzmcbKXc");
    			add_location(a12, file$1, 25, 9, 1704);
    			attr_dev(a13, "href", "https://github.com/josmorrui2");
    			add_location(a13, file$1, 25, 152, 1847);
    			add_location(li12, file$1, 25, 5, 1700);
    			attr_dev(a14, "href", "https://documenter.getpostman.com/view/6870023/SzYZ2KVA");
    			add_location(a14, file$1, 27, 9, 1942);
    			attr_dev(a15, "href", "https://github.com/martaverdugo6");
    			add_location(a15, file$1, 27, 153, 2086);
    			add_location(li13, file$1, 27, 5, 1938);
    			attr_dev(a16, "href", "https://documenter.getpostman.com/view/6870023/SzmcbKTA");
    			add_location(a16, file$1, 29, 9, 2180);
    			attr_dev(a17, "href", "https://github.com/martaverdugo6");
    			add_location(a17, file$1, 29, 153, 2324);
    			add_location(li14, file$1, 29, 5, 2176);
    			add_location(ul1, file$1, 18, 4, 973);
    			add_location(ul2, file$1, 5, 3, 84);
    			add_location(br1, file$1, 36, 2, 2438);
    			attr_dev(button0, "type", "button");
    			attr_dev(button0, "class", "btn btn-primary");
    			attr_dev(button0, "onclick", "window.location.href='#/evolution-of-cycling-routes'");
    			set_style(button0, "margin-left", "6.75%");
    			set_style(button0, "width", "25%");
    			add_location(button0, file$1, 37, 2, 2446);
    			attr_dev(button1, "type", "button");
    			attr_dev(button1, "class", "btn btn-warning");
    			attr_dev(button1, "onclick", "window.location.href='#/rural-tourism-stats'");
    			set_style(button1, "width", "25%");
    			add_location(button1, file$1, 38, 2, 2636);
    			attr_dev(button2, "type", "button");
    			attr_dev(button2, "class", "btn btn-danger");
    			attr_dev(button2, "onclick", "window.location.href='#/traffic-accidents'");
    			set_style(button2, "width", "25%");
    			add_location(button2, file$1, 39, 2, 2788);
    			add_location(br2, file$1, 39, 156, 2942);
    			add_location(br3, file$1, 39, 160, 2946);
    			attr_dev(button3, "type", "button");
    			attr_dev(button3, "class", "btn btn-primary");
    			attr_dev(button3, "onclick", "window.location.href='#/evolution-of-cycling-routes/graph'");
    			set_style(button3, "margin-left", "6.75%");
    			set_style(button3, "width", "25%");
    			add_location(button3, file$1, 40, 2, 2954);
    			attr_dev(button4, "type", "button");
    			attr_dev(button4, "class", "btn btn-warning");
    			attr_dev(button4, "onclick", "window.location.href='#/rural-tourism-stats/graph'");
    			set_style(button4, "width", "25%");
    			add_location(button4, file$1, 41, 2, 3159);
    			attr_dev(button5, "type", "button");
    			attr_dev(button5, "class", "btn btn-danger");
    			attr_dev(button5, "onclick", "window.location.href='#/traffic-accidents/graph'");
    			set_style(button5, "width", "25%");
    			add_location(button5, file$1, 42, 2, 3326);
    			add_location(br4, file$1, 42, 166, 3490);
    			add_location(br5, file$1, 42, 170, 3494);
    			attr_dev(button6, "type", "button");
    			attr_dev(button6, "class", "btn btn-primary");
    			attr_dev(button6, "onclick", "window.location.href='#/evolution-of-cycling-routes/graph-v2'");
    			set_style(button6, "margin-left", "6.75%");
    			set_style(button6, "width", "25%");
    			add_location(button6, file$1, 43, 2, 3502);
    			attr_dev(button7, "type", "button");
    			attr_dev(button7, "class", "btn btn-warning");
    			attr_dev(button7, "onclick", "window.location.href='#/rural-tourism-stats/graph-v2'");
    			set_style(button7, "width", "25%");
    			add_location(button7, file$1, 44, 2, 3710);
    			attr_dev(button8, "type", "button");
    			attr_dev(button8, "class", "btn btn-danger");
    			attr_dev(button8, "onclick", "window.location.href='#/traffic-accidents/graph-v2'");
    			set_style(button8, "width", "25%");
    			add_location(button8, file$1, 45, 2, 3880);
    			add_location(br6, file$1, 45, 156, 4034);
    			add_location(br7, file$1, 45, 160, 4038);
    			attr_dev(button9, "type", "button");
    			attr_dev(button9, "class", "btn btn-primary");
    			attr_dev(button9, "onclick", "window.location.href='#/analytics'");
    			set_style(button9, "margin-left", "6.75%");
    			set_style(button9, "width", "25%");
    			add_location(button9, file$1, 46, 2, 4046);
    			attr_dev(button10, "type", "button");
    			attr_dev(button10, "class", "btn btn-danger");
    			attr_dev(button10, "onclick", "window.location.href='#/integrations'");
    			set_style(button10, "width", "25%");
    			add_location(button10, file$1, 47, 2, 4198);
    			add_location(br8, file$1, 48, 2, 4337);
    			set_style(div0, "margin-left", "12.5%");
    			add_location(div0, file$1, 3, 2, 37);
    			attr_dev(div1, "class", "div-home");
    			add_location(div1, file$1, 1, 1, 9);
    			add_location(main, file$1, 0, 0, 0);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			append_dev(main, div1);
    			append_dev(div1, div0);
    			append_dev(div0, br0);
    			append_dev(div0, t0);
    			append_dev(div0, ul2);
    			append_dev(ul2, li0);
    			append_dev(li0, strong0);
    			append_dev(ul2, t2);
    			append_dev(ul2, ul0);
    			append_dev(ul0, li1);
    			append_dev(li1, a0);
    			append_dev(ul0, t4);
    			append_dev(ul0, li2);
    			append_dev(li2, a1);
    			append_dev(ul0, t6);
    			append_dev(ul0, li3);
    			append_dev(li3, a2);
    			append_dev(ul2, t8);
    			append_dev(ul2, li4);
    			append_dev(li4, strong1);
    			append_dev(li4, t10);
    			append_dev(ul2, t11);
    			append_dev(ul2, li5);
    			append_dev(li5, strong2);
    			append_dev(li5, a3);
    			append_dev(ul2, t14);
    			append_dev(ul2, li6);
    			append_dev(li6, strong3);
    			append_dev(li6, a4);
    			append_dev(ul2, t17);
    			append_dev(ul2, li7);
    			append_dev(li7, strong4);
    			append_dev(li7, a5);
    			append_dev(ul2, t20);
    			append_dev(ul2, li8);
    			append_dev(li8, strong5);
    			append_dev(ul2, t22);
    			append_dev(ul2, ul1);
    			append_dev(ul1, li9);
    			append_dev(li9, a6);
    			append_dev(li9, t24);
    			append_dev(li9, a7);
    			append_dev(li9, t26);
    			append_dev(ul1, t27);
    			append_dev(ul1, li10);
    			append_dev(li10, a8);
    			append_dev(li10, t29);
    			append_dev(li10, a9);
    			append_dev(li10, t31);
    			append_dev(ul1, t32);
    			append_dev(ul1, li11);
    			append_dev(li11, a10);
    			append_dev(li11, t34);
    			append_dev(li11, a11);
    			append_dev(li11, t36);
    			append_dev(ul1, t37);
    			append_dev(ul1, li12);
    			append_dev(li12, a12);
    			append_dev(li12, t39);
    			append_dev(li12, a13);
    			append_dev(li12, t41);
    			append_dev(ul1, t42);
    			append_dev(ul1, li13);
    			append_dev(li13, a14);
    			append_dev(li13, t44);
    			append_dev(li13, a15);
    			append_dev(li13, t46);
    			append_dev(ul1, t47);
    			append_dev(ul1, li14);
    			append_dev(li14, a16);
    			append_dev(li14, t49);
    			append_dev(li14, a17);
    			append_dev(li14, t51);
    			append_dev(div0, t52);
    			append_dev(div0, br1);
    			append_dev(div0, t53);
    			append_dev(div0, button0);
    			append_dev(div0, t55);
    			append_dev(div0, button1);
    			append_dev(div0, t57);
    			append_dev(div0, button2);
    			append_dev(div0, br2);
    			append_dev(div0, br3);
    			append_dev(div0, t59);
    			append_dev(div0, button3);
    			append_dev(div0, t61);
    			append_dev(div0, button4);
    			append_dev(div0, t63);
    			append_dev(div0, button5);
    			append_dev(div0, br4);
    			append_dev(div0, br5);
    			append_dev(div0, t65);
    			append_dev(div0, button6);
    			append_dev(div0, t67);
    			append_dev(div0, button7);
    			append_dev(div0, t69);
    			append_dev(div0, button8);
    			append_dev(div0, br6);
    			append_dev(div0, br7);
    			append_dev(div0, t71);
    			append_dev(div0, button9);
    			append_dev(div0, t73);
    			append_dev(div0, button10);
    			append_dev(div0, t75);
    			append_dev(div0, br8);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$2.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$2($$self, $$props) {
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Home> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("Home", $$slots, []);
    	return [];
    }

    class Home extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$2, create_fragment$2, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Home",
    			options,
    			id: create_fragment$2.name
    		});
    	}
    }

    /* src\front\Integrations.svelte generated by Svelte v3.21.0 */

    function create_fragment$3(ctx) {
    	const block = {
    		c: noop,
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: noop,
    		p: noop,
    		i: noop,
    		o: noop,
    		d: noop
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$3.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$3($$self, $$props) {
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Integrations> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("Integrations", $$slots, []);
    	return [];
    }

    class Integrations extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$3, create_fragment$3, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Integrations",
    			options,
    			id: create_fragment$3.name
    		});
    	}
    }

    /* src\front\Analytics.svelte generated by Svelte v3.21.0 */

    function create_fragment$4(ctx) {
    	const block = {
    		c: noop,
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: noop,
    		p: noop,
    		i: noop,
    		o: noop,
    		d: noop
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$4.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$4($$self, $$props) {
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Analytics> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("Analytics", $$slots, []);
    	return [];
    }

    class Analytics extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$4, create_fragment$4, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Analytics",
    			options,
    			id: create_fragment$4.name
    		});
    	}
    }

    function toVal(mix) {
    	var k, y, str='';
    	if (mix) {
    		if (typeof mix === 'object') {
    			if (Array.isArray(mix)) {
    				for (k=0; k < mix.length; k++) {
    					if (mix[k] && (y = toVal(mix[k]))) {
    						str && (str += ' ');
    						str += y;
    					}
    				}
    			} else {
    				for (k in mix) {
    					if (mix[k] && (y = toVal(k))) {
    						str && (str += ' ');
    						str += y;
    					}
    				}
    			}
    		} else if (typeof mix !== 'boolean' && !mix.call) {
    			str && (str += ' ');
    			str += mix;
    		}
    	}
    	return str;
    }

    function clsx () {
    	var i=0, x, str='';
    	while (i < arguments.length) {
    		if (x = toVal(arguments[i++])) {
    			str && (str += ' ');
    			str += x;
    		}
    	}
    	return str;
    }

    function isObject(value) {
      const type = typeof value;
      return value != null && (type == 'object' || type == 'function');
    }

    function getColumnSizeClass(isXs, colWidth, colSize) {
      if (colSize === true || colSize === '') {
        return isXs ? 'col' : `col-${colWidth}`;
      } else if (colSize === 'auto') {
        return isXs ? 'col-auto' : `col-${colWidth}-auto`;
      }

      return isXs ? `col-${colSize}` : `col-${colWidth}-${colSize}`;
    }

    function clean($$props) {
      const rest = {};
      for (const key of Object.keys($$props)) {
        if (key !== "children" && key !== "$$scope" && key !== "$$slots") {
          rest[key] = $$props[key];
        }
      }
      return rest;
    }

    /* node_modules\sveltestrap\src\Table.svelte generated by Svelte v3.21.0 */
    const file$2 = "node_modules\\sveltestrap\\src\\Table.svelte";

    // (38:0) {:else}
    function create_else_block$1(ctx) {
    	let table;
    	let current;
    	const default_slot_template = /*$$slots*/ ctx[13].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[12], null);
    	let table_levels = [/*props*/ ctx[3], { class: /*classes*/ ctx[1] }];
    	let table_data = {};

    	for (let i = 0; i < table_levels.length; i += 1) {
    		table_data = assign(table_data, table_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			table = element("table");
    			if (default_slot) default_slot.c();
    			set_attributes(table, table_data);
    			add_location(table, file$2, 38, 2, 908);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, table, anchor);

    			if (default_slot) {
    				default_slot.m(table, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && dirty & /*$$scope*/ 4096) {
    					default_slot.p(get_slot_context(default_slot_template, ctx, /*$$scope*/ ctx[12], null), get_slot_changes(default_slot_template, /*$$scope*/ ctx[12], dirty, null));
    				}
    			}

    			set_attributes(table, get_spread_update(table_levels, [
    				dirty & /*props*/ 8 && /*props*/ ctx[3],
    				dirty & /*classes*/ 2 && { class: /*classes*/ ctx[1] }
    			]));
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(table);
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$1.name,
    		type: "else",
    		source: "(38:0) {:else}",
    		ctx
    	});

    	return block;
    }

    // (32:0) {#if responsive}
    function create_if_block$1(ctx) {
    	let div;
    	let table;
    	let current;
    	const default_slot_template = /*$$slots*/ ctx[13].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[12], null);
    	let table_levels = [/*props*/ ctx[3], { class: /*classes*/ ctx[1] }];
    	let table_data = {};

    	for (let i = 0; i < table_levels.length; i += 1) {
    		table_data = assign(table_data, table_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			div = element("div");
    			table = element("table");
    			if (default_slot) default_slot.c();
    			set_attributes(table, table_data);
    			add_location(table, file$2, 33, 4, 826);
    			attr_dev(div, "class", /*responsiveClassName*/ ctx[2]);
    			add_location(div, file$2, 32, 2, 788);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, table);

    			if (default_slot) {
    				default_slot.m(table, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && dirty & /*$$scope*/ 4096) {
    					default_slot.p(get_slot_context(default_slot_template, ctx, /*$$scope*/ ctx[12], null), get_slot_changes(default_slot_template, /*$$scope*/ ctx[12], dirty, null));
    				}
    			}

    			set_attributes(table, get_spread_update(table_levels, [
    				dirty & /*props*/ 8 && /*props*/ ctx[3],
    				dirty & /*classes*/ 2 && { class: /*classes*/ ctx[1] }
    			]));

    			if (!current || dirty & /*responsiveClassName*/ 4) {
    				attr_dev(div, "class", /*responsiveClassName*/ ctx[2]);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$1.name,
    		type: "if",
    		source: "(32:0) {#if responsive}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$5(ctx) {
    	let current_block_type_index;
    	let if_block;
    	let if_block_anchor;
    	let current;
    	const if_block_creators = [create_if_block$1, create_else_block$1];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*responsive*/ ctx[0]) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if_blocks[current_block_type_index].m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				}

    				transition_in(if_block, 1);
    				if_block.m(if_block_anchor.parentNode, if_block_anchor);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if_blocks[current_block_type_index].d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$5.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$5($$self, $$props, $$invalidate) {
    	let { class: className = "" } = $$props;
    	let { size = "" } = $$props;
    	let { bordered = false } = $$props;
    	let { borderless = false } = $$props;
    	let { striped = false } = $$props;
    	let { dark = false } = $$props;
    	let { hover = false } = $$props;
    	let { responsive = false } = $$props;
    	const props = clean($$props);
    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("Table", $$slots, ['default']);

    	$$self.$set = $$new_props => {
    		$$invalidate(11, $$props = assign(assign({}, $$props), exclude_internal_props($$new_props)));
    		if ("class" in $$new_props) $$invalidate(4, className = $$new_props.class);
    		if ("size" in $$new_props) $$invalidate(5, size = $$new_props.size);
    		if ("bordered" in $$new_props) $$invalidate(6, bordered = $$new_props.bordered);
    		if ("borderless" in $$new_props) $$invalidate(7, borderless = $$new_props.borderless);
    		if ("striped" in $$new_props) $$invalidate(8, striped = $$new_props.striped);
    		if ("dark" in $$new_props) $$invalidate(9, dark = $$new_props.dark);
    		if ("hover" in $$new_props) $$invalidate(10, hover = $$new_props.hover);
    		if ("responsive" in $$new_props) $$invalidate(0, responsive = $$new_props.responsive);
    		if ("$$scope" in $$new_props) $$invalidate(12, $$scope = $$new_props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		clsx,
    		clean,
    		className,
    		size,
    		bordered,
    		borderless,
    		striped,
    		dark,
    		hover,
    		responsive,
    		props,
    		classes,
    		responsiveClassName
    	});

    	$$self.$inject_state = $$new_props => {
    		$$invalidate(11, $$props = assign(assign({}, $$props), $$new_props));
    		if ("className" in $$props) $$invalidate(4, className = $$new_props.className);
    		if ("size" in $$props) $$invalidate(5, size = $$new_props.size);
    		if ("bordered" in $$props) $$invalidate(6, bordered = $$new_props.bordered);
    		if ("borderless" in $$props) $$invalidate(7, borderless = $$new_props.borderless);
    		if ("striped" in $$props) $$invalidate(8, striped = $$new_props.striped);
    		if ("dark" in $$props) $$invalidate(9, dark = $$new_props.dark);
    		if ("hover" in $$props) $$invalidate(10, hover = $$new_props.hover);
    		if ("responsive" in $$props) $$invalidate(0, responsive = $$new_props.responsive);
    		if ("classes" in $$props) $$invalidate(1, classes = $$new_props.classes);
    		if ("responsiveClassName" in $$props) $$invalidate(2, responsiveClassName = $$new_props.responsiveClassName);
    	};

    	let classes;
    	let responsiveClassName;

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*className, size, bordered, borderless, striped, dark, hover*/ 2032) {
    			 $$invalidate(1, classes = clsx(className, "table", size ? "table-" + size : false, bordered ? "table-bordered" : false, borderless ? "table-borderless" : false, striped ? "table-striped" : false, dark ? "table-dark" : false, hover ? "table-hover" : false));
    		}

    		if ($$self.$$.dirty & /*responsive*/ 1) {
    			 $$invalidate(2, responsiveClassName = responsive === true
    			? "table-responsive"
    			: `table-responsive-${responsive}`);
    		}
    	};

    	$$props = exclude_internal_props($$props);

    	return [
    		responsive,
    		classes,
    		responsiveClassName,
    		props,
    		className,
    		size,
    		bordered,
    		borderless,
    		striped,
    		dark,
    		hover,
    		$$props,
    		$$scope,
    		$$slots
    	];
    }

    class Table extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$5, create_fragment$5, safe_not_equal, {
    			class: 4,
    			size: 5,
    			bordered: 6,
    			borderless: 7,
    			striped: 8,
    			dark: 9,
    			hover: 10,
    			responsive: 0
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Table",
    			options,
    			id: create_fragment$5.name
    		});
    	}

    	get class() {
    		throw new Error("<Table>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set class(value) {
    		throw new Error("<Table>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get size() {
    		throw new Error("<Table>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set size(value) {
    		throw new Error("<Table>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get bordered() {
    		throw new Error("<Table>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set bordered(value) {
    		throw new Error("<Table>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get borderless() {
    		throw new Error("<Table>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set borderless(value) {
    		throw new Error("<Table>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get striped() {
    		throw new Error("<Table>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set striped(value) {
    		throw new Error("<Table>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get dark() {
    		throw new Error("<Table>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set dark(value) {
    		throw new Error("<Table>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get hover() {
    		throw new Error("<Table>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set hover(value) {
    		throw new Error("<Table>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get responsive() {
    		throw new Error("<Table>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set responsive(value) {
    		throw new Error("<Table>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules\sveltestrap\src\Button.svelte generated by Svelte v3.21.0 */
    const file$3 = "node_modules\\sveltestrap\\src\\Button.svelte";

    // (53:0) {:else}
    function create_else_block_1(ctx) {
    	let button;
    	let current;
    	let dispose;
    	const default_slot_template = /*$$slots*/ ctx[19].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[18], null);
    	const default_slot_or_fallback = default_slot || fallback_block(ctx);

    	let button_levels = [
    		/*props*/ ctx[10],
    		{ id: /*id*/ ctx[4] },
    		{ class: /*classes*/ ctx[8] },
    		{ disabled: /*disabled*/ ctx[2] },
    		{ value: /*value*/ ctx[6] },
    		{
    			"aria-label": /*ariaLabel*/ ctx[7] || /*defaultAriaLabel*/ ctx[9]
    		},
    		{ style: /*style*/ ctx[5] }
    	];

    	let button_data = {};

    	for (let i = 0; i < button_levels.length; i += 1) {
    		button_data = assign(button_data, button_levels[i]);
    	}

    	const block_1 = {
    		c: function create() {
    			button = element("button");
    			if (default_slot_or_fallback) default_slot_or_fallback.c();
    			set_attributes(button, button_data);
    			add_location(button, file$3, 53, 2, 1061);
    		},
    		m: function mount(target, anchor, remount) {
    			insert_dev(target, button, anchor);

    			if (default_slot_or_fallback) {
    				default_slot_or_fallback.m(button, null);
    			}

    			current = true;
    			if (remount) dispose();
    			dispose = listen_dev(button, "click", /*click_handler_1*/ ctx[21], false, false, false);
    		},
    		p: function update(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && dirty & /*$$scope*/ 262144) {
    					default_slot.p(get_slot_context(default_slot_template, ctx, /*$$scope*/ ctx[18], null), get_slot_changes(default_slot_template, /*$$scope*/ ctx[18], dirty, null));
    				}
    			} else {
    				if (default_slot_or_fallback && default_slot_or_fallback.p && dirty & /*close, children, $$scope*/ 262147) {
    					default_slot_or_fallback.p(ctx, dirty);
    				}
    			}

    			set_attributes(button, get_spread_update(button_levels, [
    				dirty & /*props*/ 1024 && /*props*/ ctx[10],
    				dirty & /*id*/ 16 && { id: /*id*/ ctx[4] },
    				dirty & /*classes*/ 256 && { class: /*classes*/ ctx[8] },
    				dirty & /*disabled*/ 4 && { disabled: /*disabled*/ ctx[2] },
    				dirty & /*value*/ 64 && { value: /*value*/ ctx[6] },
    				dirty & /*ariaLabel, defaultAriaLabel*/ 640 && {
    					"aria-label": /*ariaLabel*/ ctx[7] || /*defaultAriaLabel*/ ctx[9]
    				},
    				dirty & /*style*/ 32 && { style: /*style*/ ctx[5] }
    			]));
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot_or_fallback, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot_or_fallback, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    			if (default_slot_or_fallback) default_slot_or_fallback.d(detaching);
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block: block_1,
    		id: create_else_block_1.name,
    		type: "else",
    		source: "(53:0) {:else}",
    		ctx
    	});

    	return block_1;
    }

    // (37:0) {#if href}
    function create_if_block$2(ctx) {
    	let a;
    	let current_block_type_index;
    	let if_block;
    	let current;
    	let dispose;
    	const if_block_creators = [create_if_block_1, create_else_block$2];
    	const if_blocks = [];

    	function select_block_type_1(ctx, dirty) {
    		if (/*children*/ ctx[0]) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type_1(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	let a_levels = [
    		/*props*/ ctx[10],
    		{ id: /*id*/ ctx[4] },
    		{ class: /*classes*/ ctx[8] },
    		{ disabled: /*disabled*/ ctx[2] },
    		{ href: /*href*/ ctx[3] },
    		{
    			"aria-label": /*ariaLabel*/ ctx[7] || /*defaultAriaLabel*/ ctx[9]
    		},
    		{ style: /*style*/ ctx[5] }
    	];

    	let a_data = {};

    	for (let i = 0; i < a_levels.length; i += 1) {
    		a_data = assign(a_data, a_levels[i]);
    	}

    	const block_1 = {
    		c: function create() {
    			a = element("a");
    			if_block.c();
    			set_attributes(a, a_data);
    			add_location(a, file$3, 37, 2, 825);
    		},
    		m: function mount(target, anchor, remount) {
    			insert_dev(target, a, anchor);
    			if_blocks[current_block_type_index].m(a, null);
    			current = true;
    			if (remount) dispose();
    			dispose = listen_dev(a, "click", /*click_handler*/ ctx[20], false, false, false);
    		},
    		p: function update(ctx, dirty) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type_1(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				}

    				transition_in(if_block, 1);
    				if_block.m(a, null);
    			}

    			set_attributes(a, get_spread_update(a_levels, [
    				dirty & /*props*/ 1024 && /*props*/ ctx[10],
    				dirty & /*id*/ 16 && { id: /*id*/ ctx[4] },
    				dirty & /*classes*/ 256 && { class: /*classes*/ ctx[8] },
    				dirty & /*disabled*/ 4 && { disabled: /*disabled*/ ctx[2] },
    				dirty & /*href*/ 8 && { href: /*href*/ ctx[3] },
    				dirty & /*ariaLabel, defaultAriaLabel*/ 640 && {
    					"aria-label": /*ariaLabel*/ ctx[7] || /*defaultAriaLabel*/ ctx[9]
    				},
    				dirty & /*style*/ 32 && { style: /*style*/ ctx[5] }
    			]));
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(a);
    			if_blocks[current_block_type_index].d();
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block: block_1,
    		id: create_if_block$2.name,
    		type: "if",
    		source: "(37:0) {#if href}",
    		ctx
    	});

    	return block_1;
    }

    // (68:6) {:else}
    function create_else_block_2(ctx) {
    	let current;
    	const default_slot_template = /*$$slots*/ ctx[19].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[18], null);

    	const block_1 = {
    		c: function create() {
    			if (default_slot) default_slot.c();
    		},
    		m: function mount(target, anchor) {
    			if (default_slot) {
    				default_slot.m(target, anchor);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && dirty & /*$$scope*/ 262144) {
    					default_slot.p(get_slot_context(default_slot_template, ctx, /*$$scope*/ ctx[18], null), get_slot_changes(default_slot_template, /*$$scope*/ ctx[18], dirty, null));
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block: block_1,
    		id: create_else_block_2.name,
    		type: "else",
    		source: "(68:6) {:else}",
    		ctx
    	});

    	return block_1;
    }

    // (66:25) 
    function create_if_block_3(ctx) {
    	let t;

    	const block_1 = {
    		c: function create() {
    			t = text(/*children*/ ctx[0]);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*children*/ 1) set_data_dev(t, /*children*/ ctx[0]);
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block: block_1,
    		id: create_if_block_3.name,
    		type: "if",
    		source: "(66:25) ",
    		ctx
    	});

    	return block_1;
    }

    // (64:6) {#if close}
    function create_if_block_2(ctx) {
    	let span;

    	const block_1 = {
    		c: function create() {
    			span = element("span");
    			span.textContent = "×";
    			attr_dev(span, "aria-hidden", "true");
    			add_location(span, file$3, 64, 8, 1250);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, span, anchor);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(span);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block: block_1,
    		id: create_if_block_2.name,
    		type: "if",
    		source: "(64:6) {#if close}",
    		ctx
    	});

    	return block_1;
    }

    // (63:10)        
    function fallback_block(ctx) {
    	let current_block_type_index;
    	let if_block;
    	let if_block_anchor;
    	let current;
    	const if_block_creators = [create_if_block_2, create_if_block_3, create_else_block_2];
    	const if_blocks = [];

    	function select_block_type_2(ctx, dirty) {
    		if (/*close*/ ctx[1]) return 0;
    		if (/*children*/ ctx[0]) return 1;
    		return 2;
    	}

    	current_block_type_index = select_block_type_2(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block_1 = {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if_blocks[current_block_type_index].m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type_2(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				}

    				transition_in(if_block, 1);
    				if_block.m(if_block_anchor.parentNode, if_block_anchor);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if_blocks[current_block_type_index].d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block: block_1,
    		id: fallback_block.name,
    		type: "fallback",
    		source: "(63:10)        ",
    		ctx
    	});

    	return block_1;
    }

    // (49:4) {:else}
    function create_else_block$2(ctx) {
    	let current;
    	const default_slot_template = /*$$slots*/ ctx[19].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[18], null);

    	const block_1 = {
    		c: function create() {
    			if (default_slot) default_slot.c();
    		},
    		m: function mount(target, anchor) {
    			if (default_slot) {
    				default_slot.m(target, anchor);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && dirty & /*$$scope*/ 262144) {
    					default_slot.p(get_slot_context(default_slot_template, ctx, /*$$scope*/ ctx[18], null), get_slot_changes(default_slot_template, /*$$scope*/ ctx[18], dirty, null));
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block: block_1,
    		id: create_else_block$2.name,
    		type: "else",
    		source: "(49:4) {:else}",
    		ctx
    	});

    	return block_1;
    }

    // (47:4) {#if children}
    function create_if_block_1(ctx) {
    	let t;

    	const block_1 = {
    		c: function create() {
    			t = text(/*children*/ ctx[0]);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*children*/ 1) set_data_dev(t, /*children*/ ctx[0]);
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block: block_1,
    		id: create_if_block_1.name,
    		type: "if",
    		source: "(47:4) {#if children}",
    		ctx
    	});

    	return block_1;
    }

    function create_fragment$6(ctx) {
    	let current_block_type_index;
    	let if_block;
    	let if_block_anchor;
    	let current;
    	const if_block_creators = [create_if_block$2, create_else_block_1];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*href*/ ctx[3]) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block_1 = {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if_blocks[current_block_type_index].m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				}

    				transition_in(if_block, 1);
    				if_block.m(if_block_anchor.parentNode, if_block_anchor);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if_blocks[current_block_type_index].d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block: block_1,
    		id: create_fragment$6.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block_1;
    }

    function instance$6($$self, $$props, $$invalidate) {
    	let { class: className = "" } = $$props;
    	let { active = false } = $$props;
    	let { block = false } = $$props;
    	let { children = undefined } = $$props;
    	let { close = false } = $$props;
    	let { color = "secondary" } = $$props;
    	let { disabled = false } = $$props;
    	let { href = "" } = $$props;
    	let { id = "" } = $$props;
    	let { outline = false } = $$props;
    	let { size = "" } = $$props;
    	let { style = "" } = $$props;
    	let { value = "" } = $$props;
    	const props = clean($$props);
    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("Button", $$slots, ['default']);

    	function click_handler(event) {
    		bubble($$self, event);
    	}

    	function click_handler_1(event) {
    		bubble($$self, event);
    	}

    	$$self.$set = $$new_props => {
    		$$invalidate(17, $$props = assign(assign({}, $$props), exclude_internal_props($$new_props)));
    		if ("class" in $$new_props) $$invalidate(11, className = $$new_props.class);
    		if ("active" in $$new_props) $$invalidate(12, active = $$new_props.active);
    		if ("block" in $$new_props) $$invalidate(13, block = $$new_props.block);
    		if ("children" in $$new_props) $$invalidate(0, children = $$new_props.children);
    		if ("close" in $$new_props) $$invalidate(1, close = $$new_props.close);
    		if ("color" in $$new_props) $$invalidate(14, color = $$new_props.color);
    		if ("disabled" in $$new_props) $$invalidate(2, disabled = $$new_props.disabled);
    		if ("href" in $$new_props) $$invalidate(3, href = $$new_props.href);
    		if ("id" in $$new_props) $$invalidate(4, id = $$new_props.id);
    		if ("outline" in $$new_props) $$invalidate(15, outline = $$new_props.outline);
    		if ("size" in $$new_props) $$invalidate(16, size = $$new_props.size);
    		if ("style" in $$new_props) $$invalidate(5, style = $$new_props.style);
    		if ("value" in $$new_props) $$invalidate(6, value = $$new_props.value);
    		if ("$$scope" in $$new_props) $$invalidate(18, $$scope = $$new_props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		clsx,
    		clean,
    		className,
    		active,
    		block,
    		children,
    		close,
    		color,
    		disabled,
    		href,
    		id,
    		outline,
    		size,
    		style,
    		value,
    		props,
    		ariaLabel,
    		classes,
    		defaultAriaLabel
    	});

    	$$self.$inject_state = $$new_props => {
    		$$invalidate(17, $$props = assign(assign({}, $$props), $$new_props));
    		if ("className" in $$props) $$invalidate(11, className = $$new_props.className);
    		if ("active" in $$props) $$invalidate(12, active = $$new_props.active);
    		if ("block" in $$props) $$invalidate(13, block = $$new_props.block);
    		if ("children" in $$props) $$invalidate(0, children = $$new_props.children);
    		if ("close" in $$props) $$invalidate(1, close = $$new_props.close);
    		if ("color" in $$props) $$invalidate(14, color = $$new_props.color);
    		if ("disabled" in $$props) $$invalidate(2, disabled = $$new_props.disabled);
    		if ("href" in $$props) $$invalidate(3, href = $$new_props.href);
    		if ("id" in $$props) $$invalidate(4, id = $$new_props.id);
    		if ("outline" in $$props) $$invalidate(15, outline = $$new_props.outline);
    		if ("size" in $$props) $$invalidate(16, size = $$new_props.size);
    		if ("style" in $$props) $$invalidate(5, style = $$new_props.style);
    		if ("value" in $$props) $$invalidate(6, value = $$new_props.value);
    		if ("ariaLabel" in $$props) $$invalidate(7, ariaLabel = $$new_props.ariaLabel);
    		if ("classes" in $$props) $$invalidate(8, classes = $$new_props.classes);
    		if ("defaultAriaLabel" in $$props) $$invalidate(9, defaultAriaLabel = $$new_props.defaultAriaLabel);
    	};

    	let ariaLabel;
    	let classes;
    	let defaultAriaLabel;

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		 $$invalidate(7, ariaLabel = $$props["aria-label"]);

    		if ($$self.$$.dirty & /*className, close, outline, color, size, block, active*/ 129026) {
    			 $$invalidate(8, classes = clsx(className, { close }, close || "btn", close || `btn${outline ? "-outline" : ""}-${color}`, size ? `btn-${size}` : false, block ? "btn-block" : false, { active }));
    		}

    		if ($$self.$$.dirty & /*close*/ 2) {
    			 $$invalidate(9, defaultAriaLabel = close ? "Close" : null);
    		}
    	};

    	$$props = exclude_internal_props($$props);

    	return [
    		children,
    		close,
    		disabled,
    		href,
    		id,
    		style,
    		value,
    		ariaLabel,
    		classes,
    		defaultAriaLabel,
    		props,
    		className,
    		active,
    		block,
    		color,
    		outline,
    		size,
    		$$props,
    		$$scope,
    		$$slots,
    		click_handler,
    		click_handler_1
    	];
    }

    class Button extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$6, create_fragment$6, safe_not_equal, {
    			class: 11,
    			active: 12,
    			block: 13,
    			children: 0,
    			close: 1,
    			color: 14,
    			disabled: 2,
    			href: 3,
    			id: 4,
    			outline: 15,
    			size: 16,
    			style: 5,
    			value: 6
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Button",
    			options,
    			id: create_fragment$6.name
    		});
    	}

    	get class() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set class(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get active() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set active(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get block() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set block(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get children() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set children(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get close() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set close(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get color() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set color(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get disabled() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set disabled(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get href() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set href(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get id() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set id(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get outline() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set outline(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get size() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set size(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get style() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set style(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get value() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set value(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules\sveltestrap\src\Input.svelte generated by Svelte v3.21.0 */

    const { console: console_1$1 } = globals;
    const file$4 = "node_modules\\sveltestrap\\src\\Input.svelte";

    // (391:39) 
    function create_if_block_17(ctx) {
    	let select;
    	let current;
    	let dispose;
    	const default_slot_template = /*$$slots*/ ctx[26].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[25], null);

    	let select_levels = [
    		/*props*/ ctx[12],
    		{ id: /*id*/ ctx[6] },
    		{ multiple: true },
    		{ class: /*classes*/ ctx[10] },
    		{ name: /*name*/ ctx[7] },
    		{ disabled: /*disabled*/ ctx[9] }
    	];

    	let select_data = {};

    	for (let i = 0; i < select_levels.length; i += 1) {
    		select_data = assign(select_data, select_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			select = element("select");
    			if (default_slot) default_slot.c();
    			set_attributes(select, select_data);
    			if (/*value*/ ctx[1] === void 0) add_render_callback(() => /*select_change_handler_1*/ ctx[161].call(select));
    			add_location(select, file$4, 391, 2, 7495);
    		},
    		m: function mount(target, anchor, remount) {
    			insert_dev(target, select, anchor);

    			if (default_slot) {
    				default_slot.m(select, null);
    			}

    			select_options(select, /*value*/ ctx[1]);
    			current = true;
    			if (remount) run_all(dispose);

    			dispose = [
    				listen_dev(select, "blur", /*blur_handler_17*/ ctx[141], false, false, false),
    				listen_dev(select, "focus", /*focus_handler_17*/ ctx[142], false, false, false),
    				listen_dev(select, "change", /*change_handler_16*/ ctx[143], false, false, false),
    				listen_dev(select, "input", /*input_handler_16*/ ctx[144], false, false, false),
    				listen_dev(select, "change", /*select_change_handler_1*/ ctx[161])
    			];
    		},
    		p: function update(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && dirty[0] & /*$$scope*/ 33554432) {
    					default_slot.p(get_slot_context(default_slot_template, ctx, /*$$scope*/ ctx[25], null), get_slot_changes(default_slot_template, /*$$scope*/ ctx[25], dirty, null));
    				}
    			}

    			set_attributes(select, get_spread_update(select_levels, [
    				dirty[0] & /*props*/ 4096 && /*props*/ ctx[12],
    				dirty[0] & /*id*/ 64 && { id: /*id*/ ctx[6] },
    				{ multiple: true },
    				dirty[0] & /*classes*/ 1024 && { class: /*classes*/ ctx[10] },
    				dirty[0] & /*name*/ 128 && { name: /*name*/ ctx[7] },
    				dirty[0] & /*disabled*/ 512 && { disabled: /*disabled*/ ctx[9] }
    			]));

    			if (dirty[0] & /*value*/ 2) {
    				select_options(select, /*value*/ ctx[1]);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(select);
    			if (default_slot) default_slot.d(detaching);
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_17.name,
    		type: "if",
    		source: "(391:39) ",
    		ctx
    	});

    	return block;
    }

    // (376:40) 
    function create_if_block_16(ctx) {
    	let select;
    	let current;
    	let dispose;
    	const default_slot_template = /*$$slots*/ ctx[26].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[25], null);

    	let select_levels = [
    		/*props*/ ctx[12],
    		{ id: /*id*/ ctx[6] },
    		{ class: /*classes*/ ctx[10] },
    		{ name: /*name*/ ctx[7] },
    		{ disabled: /*disabled*/ ctx[9] }
    	];

    	let select_data = {};

    	for (let i = 0; i < select_levels.length; i += 1) {
    		select_data = assign(select_data, select_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			select = element("select");
    			if (default_slot) default_slot.c();
    			set_attributes(select, select_data);
    			if (/*value*/ ctx[1] === void 0) add_render_callback(() => /*select_change_handler*/ ctx[160].call(select));
    			add_location(select, file$4, 376, 2, 7281);
    		},
    		m: function mount(target, anchor, remount) {
    			insert_dev(target, select, anchor);

    			if (default_slot) {
    				default_slot.m(select, null);
    			}

    			select_option(select, /*value*/ ctx[1]);
    			current = true;
    			if (remount) run_all(dispose);

    			dispose = [
    				listen_dev(select, "blur", /*blur_handler_16*/ ctx[137], false, false, false),
    				listen_dev(select, "focus", /*focus_handler_16*/ ctx[138], false, false, false),
    				listen_dev(select, "change", /*change_handler_15*/ ctx[139], false, false, false),
    				listen_dev(select, "input", /*input_handler_15*/ ctx[140], false, false, false),
    				listen_dev(select, "change", /*select_change_handler*/ ctx[160])
    			];
    		},
    		p: function update(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && dirty[0] & /*$$scope*/ 33554432) {
    					default_slot.p(get_slot_context(default_slot_template, ctx, /*$$scope*/ ctx[25], null), get_slot_changes(default_slot_template, /*$$scope*/ ctx[25], dirty, null));
    				}
    			}

    			set_attributes(select, get_spread_update(select_levels, [
    				dirty[0] & /*props*/ 4096 && /*props*/ ctx[12],
    				dirty[0] & /*id*/ 64 && { id: /*id*/ ctx[6] },
    				dirty[0] & /*classes*/ 1024 && { class: /*classes*/ ctx[10] },
    				dirty[0] & /*name*/ 128 && { name: /*name*/ ctx[7] },
    				dirty[0] & /*disabled*/ 512 && { disabled: /*disabled*/ ctx[9] }
    			]));

    			if (dirty[0] & /*value*/ 2) {
    				select_option(select, /*value*/ ctx[1]);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(select);
    			if (default_slot) default_slot.d(detaching);
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_16.name,
    		type: "if",
    		source: "(376:40) ",
    		ctx
    	});

    	return block;
    }

    // (360:29) 
    function create_if_block_15(ctx) {
    	let textarea;
    	let dispose;

    	let textarea_levels = [
    		/*props*/ ctx[12],
    		{ id: /*id*/ ctx[6] },
    		{ class: /*classes*/ ctx[10] },
    		{ name: /*name*/ ctx[7] },
    		{ disabled: /*disabled*/ ctx[9] }
    	];

    	let textarea_data = {};

    	for (let i = 0; i < textarea_levels.length; i += 1) {
    		textarea_data = assign(textarea_data, textarea_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			textarea = element("textarea");
    			set_attributes(textarea, textarea_data);
    			add_location(textarea, file$4, 360, 2, 7043);
    		},
    		m: function mount(target, anchor, remount) {
    			insert_dev(target, textarea, anchor);
    			set_input_value(textarea, /*value*/ ctx[1]);
    			if (remount) run_all(dispose);

    			dispose = [
    				listen_dev(textarea, "blur", /*blur_handler_15*/ ctx[130], false, false, false),
    				listen_dev(textarea, "focus", /*focus_handler_15*/ ctx[131], false, false, false),
    				listen_dev(textarea, "keydown", /*keydown_handler_15*/ ctx[132], false, false, false),
    				listen_dev(textarea, "keypress", /*keypress_handler_15*/ ctx[133], false, false, false),
    				listen_dev(textarea, "keyup", /*keyup_handler_15*/ ctx[134], false, false, false),
    				listen_dev(textarea, "change", /*change_handler_14*/ ctx[135], false, false, false),
    				listen_dev(textarea, "input", /*input_handler_14*/ ctx[136], false, false, false),
    				listen_dev(textarea, "input", /*textarea_input_handler*/ ctx[159])
    			];
    		},
    		p: function update(ctx, dirty) {
    			set_attributes(textarea, get_spread_update(textarea_levels, [
    				dirty[0] & /*props*/ 4096 && /*props*/ ctx[12],
    				dirty[0] & /*id*/ 64 && { id: /*id*/ ctx[6] },
    				dirty[0] & /*classes*/ 1024 && { class: /*classes*/ ctx[10] },
    				dirty[0] & /*name*/ 128 && { name: /*name*/ ctx[7] },
    				dirty[0] & /*disabled*/ 512 && { disabled: /*disabled*/ ctx[9] }
    			]));

    			if (dirty[0] & /*value*/ 2) {
    				set_input_value(textarea, /*value*/ ctx[1]);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(textarea);
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_15.name,
    		type: "if",
    		source: "(360:29) ",
    		ctx
    	});

    	return block;
    }

    // (86:0) {#if tag === 'input'}
    function create_if_block$3(ctx) {
    	let if_block_anchor;

    	function select_block_type_1(ctx, dirty) {
    		if (/*type*/ ctx[3] === "text") return create_if_block_1$1;
    		if (/*type*/ ctx[3] === "password") return create_if_block_2$1;
    		if (/*type*/ ctx[3] === "email") return create_if_block_3$1;
    		if (/*type*/ ctx[3] === "file") return create_if_block_4;
    		if (/*type*/ ctx[3] === "checkbox") return create_if_block_5;
    		if (/*type*/ ctx[3] === "radio") return create_if_block_6;
    		if (/*type*/ ctx[3] === "url") return create_if_block_7;
    		if (/*type*/ ctx[3] === "number") return create_if_block_8;
    		if (/*type*/ ctx[3] === "date") return create_if_block_9;
    		if (/*type*/ ctx[3] === "time") return create_if_block_10;
    		if (/*type*/ ctx[3] === "datetime") return create_if_block_11;
    		if (/*type*/ ctx[3] === "color") return create_if_block_12;
    		if (/*type*/ ctx[3] === "range") return create_if_block_13;
    		if (/*type*/ ctx[3] === "search") return create_if_block_14;
    		return create_else_block$3;
    	}

    	let current_block_type = select_block_type_1(ctx);
    	let if_block = current_block_type(ctx);

    	const block = {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (current_block_type === (current_block_type = select_block_type_1(ctx)) && if_block) {
    				if_block.p(ctx, dirty);
    			} else {
    				if_block.d(1);
    				if_block = current_block_type(ctx);

    				if (if_block) {
    					if_block.c();
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$3.name,
    		type: "if",
    		source: "(86:0) {#if tag === 'input'}",
    		ctx
    	});

    	return block;
    }

    // (340:2) {:else}
    function create_else_block$3(ctx) {
    	let input;
    	let dispose;

    	let input_levels = [
    		/*props*/ ctx[12],
    		{ id: /*id*/ ctx[6] },
    		{ type: /*type*/ ctx[3] },
    		{ readOnly: /*readonly*/ ctx[4] },
    		{ class: /*classes*/ ctx[10] },
    		{ name: /*name*/ ctx[7] },
    		{ disabled: /*disabled*/ ctx[9] },
    		{ placeholder: /*placeholder*/ ctx[8] },
    		{ value: /*value*/ ctx[1] }
    	];

    	let input_data = {};

    	for (let i = 0; i < input_levels.length; i += 1) {
    		input_data = assign(input_data, input_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			input = element("input");
    			set_attributes(input, input_data);
    			add_location(input, file$4, 340, 4, 6710);
    		},
    		m: function mount(target, anchor, remount) {
    			insert_dev(target, input, anchor);
    			if (remount) run_all(dispose);

    			dispose = [
    				listen_dev(input, "blur", /*blur_handler_14*/ ctx[125], false, false, false),
    				listen_dev(input, "focus", /*focus_handler_14*/ ctx[126], false, false, false),
    				listen_dev(input, "keydown", /*keydown_handler_14*/ ctx[127], false, false, false),
    				listen_dev(input, "keypress", /*keypress_handler_14*/ ctx[128], false, false, false),
    				listen_dev(input, "keyup", /*keyup_handler_14*/ ctx[129], false, false, false),
    				listen_dev(input, "input", /*handleInput*/ ctx[13], false, false, false),
    				listen_dev(input, "change", /*handleInput*/ ctx[13], false, false, false)
    			];
    		},
    		p: function update(ctx, dirty) {
    			set_attributes(input, get_spread_update(input_levels, [
    				dirty[0] & /*props*/ 4096 && /*props*/ ctx[12],
    				dirty[0] & /*id*/ 64 && { id: /*id*/ ctx[6] },
    				dirty[0] & /*type*/ 8 && { type: /*type*/ ctx[3] },
    				dirty[0] & /*readonly*/ 16 && { readOnly: /*readonly*/ ctx[4] },
    				dirty[0] & /*classes*/ 1024 && { class: /*classes*/ ctx[10] },
    				dirty[0] & /*name*/ 128 && { name: /*name*/ ctx[7] },
    				dirty[0] & /*disabled*/ 512 && { disabled: /*disabled*/ ctx[9] },
    				dirty[0] & /*placeholder*/ 256 && { placeholder: /*placeholder*/ ctx[8] },
    				dirty[0] & /*value*/ 2 && { value: /*value*/ ctx[1] }
    			]));
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(input);
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$3.name,
    		type: "else",
    		source: "(340:2) {:else}",
    		ctx
    	});

    	return block;
    }

    // (322:30) 
    function create_if_block_14(ctx) {
    	let input;
    	let dispose;

    	let input_levels = [
    		/*props*/ ctx[12],
    		{ id: /*id*/ ctx[6] },
    		{ type: "search" },
    		{ readOnly: /*readonly*/ ctx[4] },
    		{ class: /*classes*/ ctx[10] },
    		{ name: /*name*/ ctx[7] },
    		{ disabled: /*disabled*/ ctx[9] },
    		{ placeholder: /*placeholder*/ ctx[8] }
    	];

    	let input_data = {};

    	for (let i = 0; i < input_levels.length; i += 1) {
    		input_data = assign(input_data, input_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			input = element("input");
    			set_attributes(input, input_data);
    			add_location(input, file$4, 322, 4, 6422);
    		},
    		m: function mount(target, anchor, remount) {
    			insert_dev(target, input, anchor);
    			set_input_value(input, /*value*/ ctx[1]);
    			if (remount) run_all(dispose);

    			dispose = [
    				listen_dev(input, "blur", /*blur_handler_13*/ ctx[118], false, false, false),
    				listen_dev(input, "focus", /*focus_handler_13*/ ctx[119], false, false, false),
    				listen_dev(input, "keydown", /*keydown_handler_13*/ ctx[120], false, false, false),
    				listen_dev(input, "keypress", /*keypress_handler_13*/ ctx[121], false, false, false),
    				listen_dev(input, "keyup", /*keyup_handler_13*/ ctx[122], false, false, false),
    				listen_dev(input, "change", /*change_handler_13*/ ctx[123], false, false, false),
    				listen_dev(input, "input", /*input_handler_13*/ ctx[124], false, false, false),
    				listen_dev(input, "input", /*input_input_handler_9*/ ctx[158])
    			];
    		},
    		p: function update(ctx, dirty) {
    			set_attributes(input, get_spread_update(input_levels, [
    				dirty[0] & /*props*/ 4096 && /*props*/ ctx[12],
    				dirty[0] & /*id*/ 64 && { id: /*id*/ ctx[6] },
    				{ type: "search" },
    				dirty[0] & /*readonly*/ 16 && { readOnly: /*readonly*/ ctx[4] },
    				dirty[0] & /*classes*/ 1024 && { class: /*classes*/ ctx[10] },
    				dirty[0] & /*name*/ 128 && { name: /*name*/ ctx[7] },
    				dirty[0] & /*disabled*/ 512 && { disabled: /*disabled*/ ctx[9] },
    				dirty[0] & /*placeholder*/ 256 && { placeholder: /*placeholder*/ ctx[8] }
    			]));

    			if (dirty[0] & /*value*/ 2) {
    				set_input_value(input, /*value*/ ctx[1]);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(input);
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_14.name,
    		type: "if",
    		source: "(322:30) ",
    		ctx
    	});

    	return block;
    }

    // (304:29) 
    function create_if_block_13(ctx) {
    	let input;
    	let dispose;

    	let input_levels = [
    		/*props*/ ctx[12],
    		{ id: /*id*/ ctx[6] },
    		{ type: "range" },
    		{ readOnly: /*readonly*/ ctx[4] },
    		{ class: /*classes*/ ctx[10] },
    		{ name: /*name*/ ctx[7] },
    		{ disabled: /*disabled*/ ctx[9] },
    		{ placeholder: /*placeholder*/ ctx[8] }
    	];

    	let input_data = {};

    	for (let i = 0; i < input_levels.length; i += 1) {
    		input_data = assign(input_data, input_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			input = element("input");
    			set_attributes(input, input_data);
    			add_location(input, file$4, 304, 4, 6114);
    		},
    		m: function mount(target, anchor, remount) {
    			insert_dev(target, input, anchor);
    			set_input_value(input, /*value*/ ctx[1]);
    			if (remount) run_all(dispose);

    			dispose = [
    				listen_dev(input, "blur", /*blur_handler_12*/ ctx[111], false, false, false),
    				listen_dev(input, "focus", /*focus_handler_12*/ ctx[112], false, false, false),
    				listen_dev(input, "keydown", /*keydown_handler_12*/ ctx[113], false, false, false),
    				listen_dev(input, "keypress", /*keypress_handler_12*/ ctx[114], false, false, false),
    				listen_dev(input, "keyup", /*keyup_handler_12*/ ctx[115], false, false, false),
    				listen_dev(input, "change", /*change_handler_12*/ ctx[116], false, false, false),
    				listen_dev(input, "input", /*input_handler_12*/ ctx[117], false, false, false),
    				listen_dev(input, "change", /*input_change_input_handler*/ ctx[157]),
    				listen_dev(input, "input", /*input_change_input_handler*/ ctx[157])
    			];
    		},
    		p: function update(ctx, dirty) {
    			set_attributes(input, get_spread_update(input_levels, [
    				dirty[0] & /*props*/ 4096 && /*props*/ ctx[12],
    				dirty[0] & /*id*/ 64 && { id: /*id*/ ctx[6] },
    				{ type: "range" },
    				dirty[0] & /*readonly*/ 16 && { readOnly: /*readonly*/ ctx[4] },
    				dirty[0] & /*classes*/ 1024 && { class: /*classes*/ ctx[10] },
    				dirty[0] & /*name*/ 128 && { name: /*name*/ ctx[7] },
    				dirty[0] & /*disabled*/ 512 && { disabled: /*disabled*/ ctx[9] },
    				dirty[0] & /*placeholder*/ 256 && { placeholder: /*placeholder*/ ctx[8] }
    			]));

    			if (dirty[0] & /*value*/ 2) {
    				set_input_value(input, /*value*/ ctx[1]);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(input);
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_13.name,
    		type: "if",
    		source: "(304:29) ",
    		ctx
    	});

    	return block;
    }

    // (286:29) 
    function create_if_block_12(ctx) {
    	let input;
    	let dispose;

    	let input_levels = [
    		/*props*/ ctx[12],
    		{ id: /*id*/ ctx[6] },
    		{ type: "color" },
    		{ readOnly: /*readonly*/ ctx[4] },
    		{ class: /*classes*/ ctx[10] },
    		{ name: /*name*/ ctx[7] },
    		{ disabled: /*disabled*/ ctx[9] },
    		{ placeholder: /*placeholder*/ ctx[8] }
    	];

    	let input_data = {};

    	for (let i = 0; i < input_levels.length; i += 1) {
    		input_data = assign(input_data, input_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			input = element("input");
    			set_attributes(input, input_data);
    			add_location(input, file$4, 286, 4, 5807);
    		},
    		m: function mount(target, anchor, remount) {
    			insert_dev(target, input, anchor);
    			set_input_value(input, /*value*/ ctx[1]);
    			if (remount) run_all(dispose);

    			dispose = [
    				listen_dev(input, "blur", /*blur_handler_11*/ ctx[104], false, false, false),
    				listen_dev(input, "focus", /*focus_handler_11*/ ctx[105], false, false, false),
    				listen_dev(input, "keydown", /*keydown_handler_11*/ ctx[106], false, false, false),
    				listen_dev(input, "keypress", /*keypress_handler_11*/ ctx[107], false, false, false),
    				listen_dev(input, "keyup", /*keyup_handler_11*/ ctx[108], false, false, false),
    				listen_dev(input, "change", /*change_handler_11*/ ctx[109], false, false, false),
    				listen_dev(input, "input", /*input_handler_11*/ ctx[110], false, false, false),
    				listen_dev(input, "input", /*input_input_handler_8*/ ctx[156])
    			];
    		},
    		p: function update(ctx, dirty) {
    			set_attributes(input, get_spread_update(input_levels, [
    				dirty[0] & /*props*/ 4096 && /*props*/ ctx[12],
    				dirty[0] & /*id*/ 64 && { id: /*id*/ ctx[6] },
    				{ type: "color" },
    				dirty[0] & /*readonly*/ 16 && { readOnly: /*readonly*/ ctx[4] },
    				dirty[0] & /*classes*/ 1024 && { class: /*classes*/ ctx[10] },
    				dirty[0] & /*name*/ 128 && { name: /*name*/ ctx[7] },
    				dirty[0] & /*disabled*/ 512 && { disabled: /*disabled*/ ctx[9] },
    				dirty[0] & /*placeholder*/ 256 && { placeholder: /*placeholder*/ ctx[8] }
    			]));

    			if (dirty[0] & /*value*/ 2) {
    				set_input_value(input, /*value*/ ctx[1]);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(input);
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_12.name,
    		type: "if",
    		source: "(286:29) ",
    		ctx
    	});

    	return block;
    }

    // (268:32) 
    function create_if_block_11(ctx) {
    	let input;
    	let dispose;

    	let input_levels = [
    		/*props*/ ctx[12],
    		{ id: /*id*/ ctx[6] },
    		{ type: "datetime" },
    		{ readOnly: /*readonly*/ ctx[4] },
    		{ class: /*classes*/ ctx[10] },
    		{ name: /*name*/ ctx[7] },
    		{ disabled: /*disabled*/ ctx[9] },
    		{ placeholder: /*placeholder*/ ctx[8] }
    	];

    	let input_data = {};

    	for (let i = 0; i < input_levels.length; i += 1) {
    		input_data = assign(input_data, input_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			input = element("input");
    			set_attributes(input, input_data);
    			add_location(input, file$4, 268, 4, 5497);
    		},
    		m: function mount(target, anchor, remount) {
    			insert_dev(target, input, anchor);
    			set_input_value(input, /*value*/ ctx[1]);
    			if (remount) run_all(dispose);

    			dispose = [
    				listen_dev(input, "blur", /*blur_handler_10*/ ctx[97], false, false, false),
    				listen_dev(input, "focus", /*focus_handler_10*/ ctx[98], false, false, false),
    				listen_dev(input, "keydown", /*keydown_handler_10*/ ctx[99], false, false, false),
    				listen_dev(input, "keypress", /*keypress_handler_10*/ ctx[100], false, false, false),
    				listen_dev(input, "keyup", /*keyup_handler_10*/ ctx[101], false, false, false),
    				listen_dev(input, "change", /*change_handler_10*/ ctx[102], false, false, false),
    				listen_dev(input, "input", /*input_handler_10*/ ctx[103], false, false, false),
    				listen_dev(input, "input", /*input_input_handler_7*/ ctx[155])
    			];
    		},
    		p: function update(ctx, dirty) {
    			set_attributes(input, get_spread_update(input_levels, [
    				dirty[0] & /*props*/ 4096 && /*props*/ ctx[12],
    				dirty[0] & /*id*/ 64 && { id: /*id*/ ctx[6] },
    				{ type: "datetime" },
    				dirty[0] & /*readonly*/ 16 && { readOnly: /*readonly*/ ctx[4] },
    				dirty[0] & /*classes*/ 1024 && { class: /*classes*/ ctx[10] },
    				dirty[0] & /*name*/ 128 && { name: /*name*/ ctx[7] },
    				dirty[0] & /*disabled*/ 512 && { disabled: /*disabled*/ ctx[9] },
    				dirty[0] & /*placeholder*/ 256 && { placeholder: /*placeholder*/ ctx[8] }
    			]));

    			if (dirty[0] & /*value*/ 2) {
    				set_input_value(input, /*value*/ ctx[1]);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(input);
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_11.name,
    		type: "if",
    		source: "(268:32) ",
    		ctx
    	});

    	return block;
    }

    // (250:28) 
    function create_if_block_10(ctx) {
    	let input;
    	let dispose;

    	let input_levels = [
    		/*props*/ ctx[12],
    		{ id: /*id*/ ctx[6] },
    		{ type: "time" },
    		{ readOnly: /*readonly*/ ctx[4] },
    		{ class: /*classes*/ ctx[10] },
    		{ name: /*name*/ ctx[7] },
    		{ disabled: /*disabled*/ ctx[9] },
    		{ placeholder: /*placeholder*/ ctx[8] }
    	];

    	let input_data = {};

    	for (let i = 0; i < input_levels.length; i += 1) {
    		input_data = assign(input_data, input_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			input = element("input");
    			set_attributes(input, input_data);
    			add_location(input, file$4, 250, 4, 5188);
    		},
    		m: function mount(target, anchor, remount) {
    			insert_dev(target, input, anchor);
    			set_input_value(input, /*value*/ ctx[1]);
    			if (remount) run_all(dispose);

    			dispose = [
    				listen_dev(input, "blur", /*blur_handler_9*/ ctx[90], false, false, false),
    				listen_dev(input, "focus", /*focus_handler_9*/ ctx[91], false, false, false),
    				listen_dev(input, "keydown", /*keydown_handler_9*/ ctx[92], false, false, false),
    				listen_dev(input, "keypress", /*keypress_handler_9*/ ctx[93], false, false, false),
    				listen_dev(input, "keyup", /*keyup_handler_9*/ ctx[94], false, false, false),
    				listen_dev(input, "change", /*change_handler_9*/ ctx[95], false, false, false),
    				listen_dev(input, "input", /*input_handler_9*/ ctx[96], false, false, false),
    				listen_dev(input, "input", /*input_input_handler_6*/ ctx[154])
    			];
    		},
    		p: function update(ctx, dirty) {
    			set_attributes(input, get_spread_update(input_levels, [
    				dirty[0] & /*props*/ 4096 && /*props*/ ctx[12],
    				dirty[0] & /*id*/ 64 && { id: /*id*/ ctx[6] },
    				{ type: "time" },
    				dirty[0] & /*readonly*/ 16 && { readOnly: /*readonly*/ ctx[4] },
    				dirty[0] & /*classes*/ 1024 && { class: /*classes*/ ctx[10] },
    				dirty[0] & /*name*/ 128 && { name: /*name*/ ctx[7] },
    				dirty[0] & /*disabled*/ 512 && { disabled: /*disabled*/ ctx[9] },
    				dirty[0] & /*placeholder*/ 256 && { placeholder: /*placeholder*/ ctx[8] }
    			]));

    			if (dirty[0] & /*value*/ 2) {
    				set_input_value(input, /*value*/ ctx[1]);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(input);
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_10.name,
    		type: "if",
    		source: "(250:28) ",
    		ctx
    	});

    	return block;
    }

    // (232:28) 
    function create_if_block_9(ctx) {
    	let input;
    	let dispose;

    	let input_levels = [
    		/*props*/ ctx[12],
    		{ id: /*id*/ ctx[6] },
    		{ type: "date" },
    		{ readOnly: /*readonly*/ ctx[4] },
    		{ class: /*classes*/ ctx[10] },
    		{ name: /*name*/ ctx[7] },
    		{ disabled: /*disabled*/ ctx[9] },
    		{ placeholder: /*placeholder*/ ctx[8] }
    	];

    	let input_data = {};

    	for (let i = 0; i < input_levels.length; i += 1) {
    		input_data = assign(input_data, input_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			input = element("input");
    			set_attributes(input, input_data);
    			add_location(input, file$4, 232, 4, 4883);
    		},
    		m: function mount(target, anchor, remount) {
    			insert_dev(target, input, anchor);
    			set_input_value(input, /*value*/ ctx[1]);
    			if (remount) run_all(dispose);

    			dispose = [
    				listen_dev(input, "blur", /*blur_handler_8*/ ctx[83], false, false, false),
    				listen_dev(input, "focus", /*focus_handler_8*/ ctx[84], false, false, false),
    				listen_dev(input, "keydown", /*keydown_handler_8*/ ctx[85], false, false, false),
    				listen_dev(input, "keypress", /*keypress_handler_8*/ ctx[86], false, false, false),
    				listen_dev(input, "keyup", /*keyup_handler_8*/ ctx[87], false, false, false),
    				listen_dev(input, "change", /*change_handler_8*/ ctx[88], false, false, false),
    				listen_dev(input, "input", /*input_handler_8*/ ctx[89], false, false, false),
    				listen_dev(input, "input", /*input_input_handler_5*/ ctx[153])
    			];
    		},
    		p: function update(ctx, dirty) {
    			set_attributes(input, get_spread_update(input_levels, [
    				dirty[0] & /*props*/ 4096 && /*props*/ ctx[12],
    				dirty[0] & /*id*/ 64 && { id: /*id*/ ctx[6] },
    				{ type: "date" },
    				dirty[0] & /*readonly*/ 16 && { readOnly: /*readonly*/ ctx[4] },
    				dirty[0] & /*classes*/ 1024 && { class: /*classes*/ ctx[10] },
    				dirty[0] & /*name*/ 128 && { name: /*name*/ ctx[7] },
    				dirty[0] & /*disabled*/ 512 && { disabled: /*disabled*/ ctx[9] },
    				dirty[0] & /*placeholder*/ 256 && { placeholder: /*placeholder*/ ctx[8] }
    			]));

    			if (dirty[0] & /*value*/ 2) {
    				set_input_value(input, /*value*/ ctx[1]);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(input);
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_9.name,
    		type: "if",
    		source: "(232:28) ",
    		ctx
    	});

    	return block;
    }

    // (214:30) 
    function create_if_block_8(ctx) {
    	let input;
    	let dispose;

    	let input_levels = [
    		/*props*/ ctx[12],
    		{ id: /*id*/ ctx[6] },
    		{ type: "number" },
    		{ readOnly: /*readonly*/ ctx[4] },
    		{ class: /*classes*/ ctx[10] },
    		{ name: /*name*/ ctx[7] },
    		{ disabled: /*disabled*/ ctx[9] },
    		{ placeholder: /*placeholder*/ ctx[8] }
    	];

    	let input_data = {};

    	for (let i = 0; i < input_levels.length; i += 1) {
    		input_data = assign(input_data, input_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			input = element("input");
    			set_attributes(input, input_data);
    			add_location(input, file$4, 214, 4, 4576);
    		},
    		m: function mount(target, anchor, remount) {
    			insert_dev(target, input, anchor);
    			set_input_value(input, /*value*/ ctx[1]);
    			if (remount) run_all(dispose);

    			dispose = [
    				listen_dev(input, "blur", /*blur_handler_7*/ ctx[76], false, false, false),
    				listen_dev(input, "focus", /*focus_handler_7*/ ctx[77], false, false, false),
    				listen_dev(input, "keydown", /*keydown_handler_7*/ ctx[78], false, false, false),
    				listen_dev(input, "keypress", /*keypress_handler_7*/ ctx[79], false, false, false),
    				listen_dev(input, "keyup", /*keyup_handler_7*/ ctx[80], false, false, false),
    				listen_dev(input, "change", /*change_handler_7*/ ctx[81], false, false, false),
    				listen_dev(input, "input", /*input_handler_7*/ ctx[82], false, false, false),
    				listen_dev(input, "input", /*input_input_handler_4*/ ctx[152])
    			];
    		},
    		p: function update(ctx, dirty) {
    			set_attributes(input, get_spread_update(input_levels, [
    				dirty[0] & /*props*/ 4096 && /*props*/ ctx[12],
    				dirty[0] & /*id*/ 64 && { id: /*id*/ ctx[6] },
    				{ type: "number" },
    				dirty[0] & /*readonly*/ 16 && { readOnly: /*readonly*/ ctx[4] },
    				dirty[0] & /*classes*/ 1024 && { class: /*classes*/ ctx[10] },
    				dirty[0] & /*name*/ 128 && { name: /*name*/ ctx[7] },
    				dirty[0] & /*disabled*/ 512 && { disabled: /*disabled*/ ctx[9] },
    				dirty[0] & /*placeholder*/ 256 && { placeholder: /*placeholder*/ ctx[8] }
    			]));

    			if (dirty[0] & /*value*/ 2 && to_number(input.value) !== /*value*/ ctx[1]) {
    				set_input_value(input, /*value*/ ctx[1]);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(input);
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_8.name,
    		type: "if",
    		source: "(214:30) ",
    		ctx
    	});

    	return block;
    }

    // (196:27) 
    function create_if_block_7(ctx) {
    	let input;
    	let dispose;

    	let input_levels = [
    		/*props*/ ctx[12],
    		{ id: /*id*/ ctx[6] },
    		{ type: "url" },
    		{ readOnly: /*readonly*/ ctx[4] },
    		{ class: /*classes*/ ctx[10] },
    		{ name: /*name*/ ctx[7] },
    		{ disabled: /*disabled*/ ctx[9] },
    		{ placeholder: /*placeholder*/ ctx[8] }
    	];

    	let input_data = {};

    	for (let i = 0; i < input_levels.length; i += 1) {
    		input_data = assign(input_data, input_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			input = element("input");
    			set_attributes(input, input_data);
    			add_location(input, file$4, 196, 4, 4270);
    		},
    		m: function mount(target, anchor, remount) {
    			insert_dev(target, input, anchor);
    			set_input_value(input, /*value*/ ctx[1]);
    			if (remount) run_all(dispose);

    			dispose = [
    				listen_dev(input, "blur", /*blur_handler_6*/ ctx[69], false, false, false),
    				listen_dev(input, "focus", /*focus_handler_6*/ ctx[70], false, false, false),
    				listen_dev(input, "keydown", /*keydown_handler_6*/ ctx[71], false, false, false),
    				listen_dev(input, "keypress", /*keypress_handler_6*/ ctx[72], false, false, false),
    				listen_dev(input, "keyup", /*keyup_handler_6*/ ctx[73], false, false, false),
    				listen_dev(input, "change", /*change_handler_6*/ ctx[74], false, false, false),
    				listen_dev(input, "input", /*input_handler_6*/ ctx[75], false, false, false),
    				listen_dev(input, "input", /*input_input_handler_3*/ ctx[151])
    			];
    		},
    		p: function update(ctx, dirty) {
    			set_attributes(input, get_spread_update(input_levels, [
    				dirty[0] & /*props*/ 4096 && /*props*/ ctx[12],
    				dirty[0] & /*id*/ 64 && { id: /*id*/ ctx[6] },
    				{ type: "url" },
    				dirty[0] & /*readonly*/ 16 && { readOnly: /*readonly*/ ctx[4] },
    				dirty[0] & /*classes*/ 1024 && { class: /*classes*/ ctx[10] },
    				dirty[0] & /*name*/ 128 && { name: /*name*/ ctx[7] },
    				dirty[0] & /*disabled*/ 512 && { disabled: /*disabled*/ ctx[9] },
    				dirty[0] & /*placeholder*/ 256 && { placeholder: /*placeholder*/ ctx[8] }
    			]));

    			if (dirty[0] & /*value*/ 2) {
    				set_input_value(input, /*value*/ ctx[1]);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(input);
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_7.name,
    		type: "if",
    		source: "(196:27) ",
    		ctx
    	});

    	return block;
    }

    // (178:29) 
    function create_if_block_6(ctx) {
    	let input;
    	let dispose;

    	let input_levels = [
    		/*props*/ ctx[12],
    		{ id: /*id*/ ctx[6] },
    		{ type: "radio" },
    		{ readOnly: /*readonly*/ ctx[4] },
    		{ class: /*classes*/ ctx[10] },
    		{ name: /*name*/ ctx[7] },
    		{ disabled: /*disabled*/ ctx[9] },
    		{ placeholder: /*placeholder*/ ctx[8] }
    	];

    	let input_data = {};

    	for (let i = 0; i < input_levels.length; i += 1) {
    		input_data = assign(input_data, input_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			input = element("input");
    			set_attributes(input, input_data);
    			add_location(input, file$4, 178, 4, 3965);
    		},
    		m: function mount(target, anchor, remount) {
    			insert_dev(target, input, anchor);
    			set_input_value(input, /*value*/ ctx[1]);
    			if (remount) run_all(dispose);

    			dispose = [
    				listen_dev(input, "blur", /*blur_handler_5*/ ctx[62], false, false, false),
    				listen_dev(input, "focus", /*focus_handler_5*/ ctx[63], false, false, false),
    				listen_dev(input, "keydown", /*keydown_handler_5*/ ctx[64], false, false, false),
    				listen_dev(input, "keypress", /*keypress_handler_5*/ ctx[65], false, false, false),
    				listen_dev(input, "keyup", /*keyup_handler_5*/ ctx[66], false, false, false),
    				listen_dev(input, "change", /*change_handler_5*/ ctx[67], false, false, false),
    				listen_dev(input, "input", /*input_handler_5*/ ctx[68], false, false, false),
    				listen_dev(input, "change", /*input_change_handler_2*/ ctx[150])
    			];
    		},
    		p: function update(ctx, dirty) {
    			set_attributes(input, get_spread_update(input_levels, [
    				dirty[0] & /*props*/ 4096 && /*props*/ ctx[12],
    				dirty[0] & /*id*/ 64 && { id: /*id*/ ctx[6] },
    				{ type: "radio" },
    				dirty[0] & /*readonly*/ 16 && { readOnly: /*readonly*/ ctx[4] },
    				dirty[0] & /*classes*/ 1024 && { class: /*classes*/ ctx[10] },
    				dirty[0] & /*name*/ 128 && { name: /*name*/ ctx[7] },
    				dirty[0] & /*disabled*/ 512 && { disabled: /*disabled*/ ctx[9] },
    				dirty[0] & /*placeholder*/ 256 && { placeholder: /*placeholder*/ ctx[8] }
    			]));

    			if (dirty[0] & /*value*/ 2) {
    				set_input_value(input, /*value*/ ctx[1]);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(input);
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_6.name,
    		type: "if",
    		source: "(178:29) ",
    		ctx
    	});

    	return block;
    }

    // (159:32) 
    function create_if_block_5(ctx) {
    	let input;
    	let dispose;

    	let input_levels = [
    		/*props*/ ctx[12],
    		{ id: /*id*/ ctx[6] },
    		{ type: "checkbox" },
    		{ readOnly: /*readonly*/ ctx[4] },
    		{ class: /*classes*/ ctx[10] },
    		{ name: /*name*/ ctx[7] },
    		{ disabled: /*disabled*/ ctx[9] },
    		{ placeholder: /*placeholder*/ ctx[8] }
    	];

    	let input_data = {};

    	for (let i = 0; i < input_levels.length; i += 1) {
    		input_data = assign(input_data, input_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			input = element("input");
    			set_attributes(input, input_data);
    			add_location(input, file$4, 159, 4, 3636);
    		},
    		m: function mount(target, anchor, remount) {
    			insert_dev(target, input, anchor);
    			input.checked = /*checked*/ ctx[0];
    			set_input_value(input, /*value*/ ctx[1]);
    			if (remount) run_all(dispose);

    			dispose = [
    				listen_dev(input, "blur", /*blur_handler_4*/ ctx[55], false, false, false),
    				listen_dev(input, "focus", /*focus_handler_4*/ ctx[56], false, false, false),
    				listen_dev(input, "keydown", /*keydown_handler_4*/ ctx[57], false, false, false),
    				listen_dev(input, "keypress", /*keypress_handler_4*/ ctx[58], false, false, false),
    				listen_dev(input, "keyup", /*keyup_handler_4*/ ctx[59], false, false, false),
    				listen_dev(input, "change", /*change_handler_4*/ ctx[60], false, false, false),
    				listen_dev(input, "input", /*input_handler_4*/ ctx[61], false, false, false),
    				listen_dev(input, "change", /*input_change_handler_1*/ ctx[149])
    			];
    		},
    		p: function update(ctx, dirty) {
    			set_attributes(input, get_spread_update(input_levels, [
    				dirty[0] & /*props*/ 4096 && /*props*/ ctx[12],
    				dirty[0] & /*id*/ 64 && { id: /*id*/ ctx[6] },
    				{ type: "checkbox" },
    				dirty[0] & /*readonly*/ 16 && { readOnly: /*readonly*/ ctx[4] },
    				dirty[0] & /*classes*/ 1024 && { class: /*classes*/ ctx[10] },
    				dirty[0] & /*name*/ 128 && { name: /*name*/ ctx[7] },
    				dirty[0] & /*disabled*/ 512 && { disabled: /*disabled*/ ctx[9] },
    				dirty[0] & /*placeholder*/ 256 && { placeholder: /*placeholder*/ ctx[8] }
    			]));

    			if (dirty[0] & /*checked*/ 1) {
    				input.checked = /*checked*/ ctx[0];
    			}

    			if (dirty[0] & /*value*/ 2) {
    				set_input_value(input, /*value*/ ctx[1]);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(input);
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_5.name,
    		type: "if",
    		source: "(159:32) ",
    		ctx
    	});

    	return block;
    }

    // (141:28) 
    function create_if_block_4(ctx) {
    	let input;
    	let dispose;

    	let input_levels = [
    		/*props*/ ctx[12],
    		{ id: /*id*/ ctx[6] },
    		{ type: "file" },
    		{ readOnly: /*readonly*/ ctx[4] },
    		{ class: /*classes*/ ctx[10] },
    		{ name: /*name*/ ctx[7] },
    		{ disabled: /*disabled*/ ctx[9] },
    		{ placeholder: /*placeholder*/ ctx[8] }
    	];

    	let input_data = {};

    	for (let i = 0; i < input_levels.length; i += 1) {
    		input_data = assign(input_data, input_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			input = element("input");
    			set_attributes(input, input_data);
    			add_location(input, file$4, 141, 4, 3327);
    		},
    		m: function mount(target, anchor, remount) {
    			insert_dev(target, input, anchor);
    			if (remount) run_all(dispose);

    			dispose = [
    				listen_dev(input, "blur", /*blur_handler_3*/ ctx[48], false, false, false),
    				listen_dev(input, "focus", /*focus_handler_3*/ ctx[49], false, false, false),
    				listen_dev(input, "keydown", /*keydown_handler_3*/ ctx[50], false, false, false),
    				listen_dev(input, "keypress", /*keypress_handler_3*/ ctx[51], false, false, false),
    				listen_dev(input, "keyup", /*keyup_handler_3*/ ctx[52], false, false, false),
    				listen_dev(input, "change", /*change_handler_3*/ ctx[53], false, false, false),
    				listen_dev(input, "input", /*input_handler_3*/ ctx[54], false, false, false),
    				listen_dev(input, "change", /*input_change_handler*/ ctx[148])
    			];
    		},
    		p: function update(ctx, dirty) {
    			set_attributes(input, get_spread_update(input_levels, [
    				dirty[0] & /*props*/ 4096 && /*props*/ ctx[12],
    				dirty[0] & /*id*/ 64 && { id: /*id*/ ctx[6] },
    				{ type: "file" },
    				dirty[0] & /*readonly*/ 16 && { readOnly: /*readonly*/ ctx[4] },
    				dirty[0] & /*classes*/ 1024 && { class: /*classes*/ ctx[10] },
    				dirty[0] & /*name*/ 128 && { name: /*name*/ ctx[7] },
    				dirty[0] & /*disabled*/ 512 && { disabled: /*disabled*/ ctx[9] },
    				dirty[0] & /*placeholder*/ 256 && { placeholder: /*placeholder*/ ctx[8] }
    			]));
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(input);
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_4.name,
    		type: "if",
    		source: "(141:28) ",
    		ctx
    	});

    	return block;
    }

    // (123:29) 
    function create_if_block_3$1(ctx) {
    	let input;
    	let dispose;

    	let input_levels = [
    		/*props*/ ctx[12],
    		{ id: /*id*/ ctx[6] },
    		{ type: "email" },
    		{ readOnly: /*readonly*/ ctx[4] },
    		{ class: /*classes*/ ctx[10] },
    		{ name: /*name*/ ctx[7] },
    		{ disabled: /*disabled*/ ctx[9] },
    		{ placeholder: /*placeholder*/ ctx[8] }
    	];

    	let input_data = {};

    	for (let i = 0; i < input_levels.length; i += 1) {
    		input_data = assign(input_data, input_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			input = element("input");
    			set_attributes(input, input_data);
    			add_location(input, file$4, 123, 4, 3021);
    		},
    		m: function mount(target, anchor, remount) {
    			insert_dev(target, input, anchor);
    			set_input_value(input, /*value*/ ctx[1]);
    			if (remount) run_all(dispose);

    			dispose = [
    				listen_dev(input, "blur", /*blur_handler_2*/ ctx[41], false, false, false),
    				listen_dev(input, "focus", /*focus_handler_2*/ ctx[42], false, false, false),
    				listen_dev(input, "keydown", /*keydown_handler_2*/ ctx[43], false, false, false),
    				listen_dev(input, "keypress", /*keypress_handler_2*/ ctx[44], false, false, false),
    				listen_dev(input, "keyup", /*keyup_handler_2*/ ctx[45], false, false, false),
    				listen_dev(input, "change", /*change_handler_2*/ ctx[46], false, false, false),
    				listen_dev(input, "input", /*input_handler_2*/ ctx[47], false, false, false),
    				listen_dev(input, "input", /*input_input_handler_2*/ ctx[147])
    			];
    		},
    		p: function update(ctx, dirty) {
    			set_attributes(input, get_spread_update(input_levels, [
    				dirty[0] & /*props*/ 4096 && /*props*/ ctx[12],
    				dirty[0] & /*id*/ 64 && { id: /*id*/ ctx[6] },
    				{ type: "email" },
    				dirty[0] & /*readonly*/ 16 && { readOnly: /*readonly*/ ctx[4] },
    				dirty[0] & /*classes*/ 1024 && { class: /*classes*/ ctx[10] },
    				dirty[0] & /*name*/ 128 && { name: /*name*/ ctx[7] },
    				dirty[0] & /*disabled*/ 512 && { disabled: /*disabled*/ ctx[9] },
    				dirty[0] & /*placeholder*/ 256 && { placeholder: /*placeholder*/ ctx[8] }
    			]));

    			if (dirty[0] & /*value*/ 2 && input.value !== /*value*/ ctx[1]) {
    				set_input_value(input, /*value*/ ctx[1]);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(input);
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_3$1.name,
    		type: "if",
    		source: "(123:29) ",
    		ctx
    	});

    	return block;
    }

    // (105:32) 
    function create_if_block_2$1(ctx) {
    	let input;
    	let dispose;

    	let input_levels = [
    		/*props*/ ctx[12],
    		{ id: /*id*/ ctx[6] },
    		{ type: "password" },
    		{ readOnly: /*readonly*/ ctx[4] },
    		{ class: /*classes*/ ctx[10] },
    		{ name: /*name*/ ctx[7] },
    		{ disabled: /*disabled*/ ctx[9] },
    		{ placeholder: /*placeholder*/ ctx[8] }
    	];

    	let input_data = {};

    	for (let i = 0; i < input_levels.length; i += 1) {
    		input_data = assign(input_data, input_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			input = element("input");
    			set_attributes(input, input_data);
    			add_location(input, file$4, 105, 4, 2711);
    		},
    		m: function mount(target, anchor, remount) {
    			insert_dev(target, input, anchor);
    			set_input_value(input, /*value*/ ctx[1]);
    			if (remount) run_all(dispose);

    			dispose = [
    				listen_dev(input, "blur", /*blur_handler_1*/ ctx[34], false, false, false),
    				listen_dev(input, "focus", /*focus_handler_1*/ ctx[35], false, false, false),
    				listen_dev(input, "keydown", /*keydown_handler_1*/ ctx[36], false, false, false),
    				listen_dev(input, "keypress", /*keypress_handler_1*/ ctx[37], false, false, false),
    				listen_dev(input, "keyup", /*keyup_handler_1*/ ctx[38], false, false, false),
    				listen_dev(input, "change", /*change_handler_1*/ ctx[39], false, false, false),
    				listen_dev(input, "input", /*input_handler_1*/ ctx[40], false, false, false),
    				listen_dev(input, "input", /*input_input_handler_1*/ ctx[146])
    			];
    		},
    		p: function update(ctx, dirty) {
    			set_attributes(input, get_spread_update(input_levels, [
    				dirty[0] & /*props*/ 4096 && /*props*/ ctx[12],
    				dirty[0] & /*id*/ 64 && { id: /*id*/ ctx[6] },
    				{ type: "password" },
    				dirty[0] & /*readonly*/ 16 && { readOnly: /*readonly*/ ctx[4] },
    				dirty[0] & /*classes*/ 1024 && { class: /*classes*/ ctx[10] },
    				dirty[0] & /*name*/ 128 && { name: /*name*/ ctx[7] },
    				dirty[0] & /*disabled*/ 512 && { disabled: /*disabled*/ ctx[9] },
    				dirty[0] & /*placeholder*/ 256 && { placeholder: /*placeholder*/ ctx[8] }
    			]));

    			if (dirty[0] & /*value*/ 2 && input.value !== /*value*/ ctx[1]) {
    				set_input_value(input, /*value*/ ctx[1]);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(input);
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2$1.name,
    		type: "if",
    		source: "(105:32) ",
    		ctx
    	});

    	return block;
    }

    // (87:2) {#if type === 'text'}
    function create_if_block_1$1(ctx) {
    	let input;
    	let dispose;

    	let input_levels = [
    		/*props*/ ctx[12],
    		{ id: /*id*/ ctx[6] },
    		{ type: "text" },
    		{ readOnly: /*readonly*/ ctx[4] },
    		{ class: /*classes*/ ctx[10] },
    		{ name: /*name*/ ctx[7] },
    		{ disabled: /*disabled*/ ctx[9] },
    		{ placeholder: /*placeholder*/ ctx[8] }
    	];

    	let input_data = {};

    	for (let i = 0; i < input_levels.length; i += 1) {
    		input_data = assign(input_data, input_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			input = element("input");
    			set_attributes(input, input_data);
    			add_location(input, file$4, 87, 4, 2402);
    		},
    		m: function mount(target, anchor, remount) {
    			insert_dev(target, input, anchor);
    			set_input_value(input, /*value*/ ctx[1]);
    			if (remount) run_all(dispose);

    			dispose = [
    				listen_dev(input, "blur", /*blur_handler*/ ctx[27], false, false, false),
    				listen_dev(input, "focus", /*focus_handler*/ ctx[28], false, false, false),
    				listen_dev(input, "keydown", /*keydown_handler*/ ctx[29], false, false, false),
    				listen_dev(input, "keypress", /*keypress_handler*/ ctx[30], false, false, false),
    				listen_dev(input, "keyup", /*keyup_handler*/ ctx[31], false, false, false),
    				listen_dev(input, "change", /*change_handler*/ ctx[32], false, false, false),
    				listen_dev(input, "input", /*input_handler*/ ctx[33], false, false, false),
    				listen_dev(input, "input", /*input_input_handler*/ ctx[145])
    			];
    		},
    		p: function update(ctx, dirty) {
    			set_attributes(input, get_spread_update(input_levels, [
    				dirty[0] & /*props*/ 4096 && /*props*/ ctx[12],
    				dirty[0] & /*id*/ 64 && { id: /*id*/ ctx[6] },
    				{ type: "text" },
    				dirty[0] & /*readonly*/ 16 && { readOnly: /*readonly*/ ctx[4] },
    				dirty[0] & /*classes*/ 1024 && { class: /*classes*/ ctx[10] },
    				dirty[0] & /*name*/ 128 && { name: /*name*/ ctx[7] },
    				dirty[0] & /*disabled*/ 512 && { disabled: /*disabled*/ ctx[9] },
    				dirty[0] & /*placeholder*/ 256 && { placeholder: /*placeholder*/ ctx[8] }
    			]));

    			if (dirty[0] & /*value*/ 2 && input.value !== /*value*/ ctx[1]) {
    				set_input_value(input, /*value*/ ctx[1]);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(input);
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$1.name,
    		type: "if",
    		source: "(87:2) {#if type === 'text'}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$7(ctx) {
    	let current_block_type_index;
    	let if_block;
    	let if_block_anchor;
    	let current;
    	const if_block_creators = [create_if_block$3, create_if_block_15, create_if_block_16, create_if_block_17];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*tag*/ ctx[11] === "input") return 0;
    		if (/*tag*/ ctx[11] === "textarea") return 1;
    		if (/*tag*/ ctx[11] === "select" && !/*multiple*/ ctx[5]) return 2;
    		if (/*tag*/ ctx[11] === "select" && /*multiple*/ ctx[5]) return 3;
    		return -1;
    	}

    	if (~(current_block_type_index = select_block_type(ctx))) {
    		if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    	}

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if (~current_block_type_index) {
    				if_blocks[current_block_type_index].m(target, anchor);
    			}

    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if (~current_block_type_index) {
    					if_blocks[current_block_type_index].p(ctx, dirty);
    				}
    			} else {
    				if (if_block) {
    					group_outros();

    					transition_out(if_blocks[previous_block_index], 1, 1, () => {
    						if_blocks[previous_block_index] = null;
    					});

    					check_outros();
    				}

    				if (~current_block_type_index) {
    					if_block = if_blocks[current_block_type_index];

    					if (!if_block) {
    						if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    						if_block.c();
    					}

    					transition_in(if_block, 1);
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				} else {
    					if_block = null;
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (~current_block_type_index) {
    				if_blocks[current_block_type_index].d(detaching);
    			}

    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$7.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$7($$self, $$props, $$invalidate) {
    	let { class: className = "" } = $$props;
    	let { type = "text" } = $$props;
    	let { size = undefined } = $$props;
    	let { bsSize = undefined } = $$props;
    	let { color = undefined } = $$props;
    	let { checked = false } = $$props;
    	let { valid = false } = $$props;
    	let { invalid = false } = $$props;
    	let { plaintext = false } = $$props;
    	let { addon = false } = $$props;
    	let { value = "" } = $$props;
    	let { files = "" } = $$props;
    	let { readonly } = $$props;
    	let { multiple = false } = $$props;
    	let { id = "" } = $$props;
    	let { name = "" } = $$props;
    	let { placeholder = "" } = $$props;
    	let { disabled = false } = $$props;

    	// eslint-disable-next-line no-unused-vars
    	const { type: _omitType, color: _omitColor, ...props } = clean($$props);

    	let classes;
    	let tag;

    	const handleInput = event => {
    		$$invalidate(1, value = event.target.value);
    	};

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("Input", $$slots, ['default']);

    	function blur_handler(event) {
    		bubble($$self, event);
    	}

    	function focus_handler(event) {
    		bubble($$self, event);
    	}

    	function keydown_handler(event) {
    		bubble($$self, event);
    	}

    	function keypress_handler(event) {
    		bubble($$self, event);
    	}

    	function keyup_handler(event) {
    		bubble($$self, event);
    	}

    	function change_handler(event) {
    		bubble($$self, event);
    	}

    	function input_handler(event) {
    		bubble($$self, event);
    	}

    	function blur_handler_1(event) {
    		bubble($$self, event);
    	}

    	function focus_handler_1(event) {
    		bubble($$self, event);
    	}

    	function keydown_handler_1(event) {
    		bubble($$self, event);
    	}

    	function keypress_handler_1(event) {
    		bubble($$self, event);
    	}

    	function keyup_handler_1(event) {
    		bubble($$self, event);
    	}

    	function change_handler_1(event) {
    		bubble($$self, event);
    	}

    	function input_handler_1(event) {
    		bubble($$self, event);
    	}

    	function blur_handler_2(event) {
    		bubble($$self, event);
    	}

    	function focus_handler_2(event) {
    		bubble($$self, event);
    	}

    	function keydown_handler_2(event) {
    		bubble($$self, event);
    	}

    	function keypress_handler_2(event) {
    		bubble($$self, event);
    	}

    	function keyup_handler_2(event) {
    		bubble($$self, event);
    	}

    	function change_handler_2(event) {
    		bubble($$self, event);
    	}

    	function input_handler_2(event) {
    		bubble($$self, event);
    	}

    	function blur_handler_3(event) {
    		bubble($$self, event);
    	}

    	function focus_handler_3(event) {
    		bubble($$self, event);
    	}

    	function keydown_handler_3(event) {
    		bubble($$self, event);
    	}

    	function keypress_handler_3(event) {
    		bubble($$self, event);
    	}

    	function keyup_handler_3(event) {
    		bubble($$self, event);
    	}

    	function change_handler_3(event) {
    		bubble($$self, event);
    	}

    	function input_handler_3(event) {
    		bubble($$self, event);
    	}

    	function blur_handler_4(event) {
    		bubble($$self, event);
    	}

    	function focus_handler_4(event) {
    		bubble($$self, event);
    	}

    	function keydown_handler_4(event) {
    		bubble($$self, event);
    	}

    	function keypress_handler_4(event) {
    		bubble($$self, event);
    	}

    	function keyup_handler_4(event) {
    		bubble($$self, event);
    	}

    	function change_handler_4(event) {
    		bubble($$self, event);
    	}

    	function input_handler_4(event) {
    		bubble($$self, event);
    	}

    	function blur_handler_5(event) {
    		bubble($$self, event);
    	}

    	function focus_handler_5(event) {
    		bubble($$self, event);
    	}

    	function keydown_handler_5(event) {
    		bubble($$self, event);
    	}

    	function keypress_handler_5(event) {
    		bubble($$self, event);
    	}

    	function keyup_handler_5(event) {
    		bubble($$self, event);
    	}

    	function change_handler_5(event) {
    		bubble($$self, event);
    	}

    	function input_handler_5(event) {
    		bubble($$self, event);
    	}

    	function blur_handler_6(event) {
    		bubble($$self, event);
    	}

    	function focus_handler_6(event) {
    		bubble($$self, event);
    	}

    	function keydown_handler_6(event) {
    		bubble($$self, event);
    	}

    	function keypress_handler_6(event) {
    		bubble($$self, event);
    	}

    	function keyup_handler_6(event) {
    		bubble($$self, event);
    	}

    	function change_handler_6(event) {
    		bubble($$self, event);
    	}

    	function input_handler_6(event) {
    		bubble($$self, event);
    	}

    	function blur_handler_7(event) {
    		bubble($$self, event);
    	}

    	function focus_handler_7(event) {
    		bubble($$self, event);
    	}

    	function keydown_handler_7(event) {
    		bubble($$self, event);
    	}

    	function keypress_handler_7(event) {
    		bubble($$self, event);
    	}

    	function keyup_handler_7(event) {
    		bubble($$self, event);
    	}

    	function change_handler_7(event) {
    		bubble($$self, event);
    	}

    	function input_handler_7(event) {
    		bubble($$self, event);
    	}

    	function blur_handler_8(event) {
    		bubble($$self, event);
    	}

    	function focus_handler_8(event) {
    		bubble($$self, event);
    	}

    	function keydown_handler_8(event) {
    		bubble($$self, event);
    	}

    	function keypress_handler_8(event) {
    		bubble($$self, event);
    	}

    	function keyup_handler_8(event) {
    		bubble($$self, event);
    	}

    	function change_handler_8(event) {
    		bubble($$self, event);
    	}

    	function input_handler_8(event) {
    		bubble($$self, event);
    	}

    	function blur_handler_9(event) {
    		bubble($$self, event);
    	}

    	function focus_handler_9(event) {
    		bubble($$self, event);
    	}

    	function keydown_handler_9(event) {
    		bubble($$self, event);
    	}

    	function keypress_handler_9(event) {
    		bubble($$self, event);
    	}

    	function keyup_handler_9(event) {
    		bubble($$self, event);
    	}

    	function change_handler_9(event) {
    		bubble($$self, event);
    	}

    	function input_handler_9(event) {
    		bubble($$self, event);
    	}

    	function blur_handler_10(event) {
    		bubble($$self, event);
    	}

    	function focus_handler_10(event) {
    		bubble($$self, event);
    	}

    	function keydown_handler_10(event) {
    		bubble($$self, event);
    	}

    	function keypress_handler_10(event) {
    		bubble($$self, event);
    	}

    	function keyup_handler_10(event) {
    		bubble($$self, event);
    	}

    	function change_handler_10(event) {
    		bubble($$self, event);
    	}

    	function input_handler_10(event) {
    		bubble($$self, event);
    	}

    	function blur_handler_11(event) {
    		bubble($$self, event);
    	}

    	function focus_handler_11(event) {
    		bubble($$self, event);
    	}

    	function keydown_handler_11(event) {
    		bubble($$self, event);
    	}

    	function keypress_handler_11(event) {
    		bubble($$self, event);
    	}

    	function keyup_handler_11(event) {
    		bubble($$self, event);
    	}

    	function change_handler_11(event) {
    		bubble($$self, event);
    	}

    	function input_handler_11(event) {
    		bubble($$self, event);
    	}

    	function blur_handler_12(event) {
    		bubble($$self, event);
    	}

    	function focus_handler_12(event) {
    		bubble($$self, event);
    	}

    	function keydown_handler_12(event) {
    		bubble($$self, event);
    	}

    	function keypress_handler_12(event) {
    		bubble($$self, event);
    	}

    	function keyup_handler_12(event) {
    		bubble($$self, event);
    	}

    	function change_handler_12(event) {
    		bubble($$self, event);
    	}

    	function input_handler_12(event) {
    		bubble($$self, event);
    	}

    	function blur_handler_13(event) {
    		bubble($$self, event);
    	}

    	function focus_handler_13(event) {
    		bubble($$self, event);
    	}

    	function keydown_handler_13(event) {
    		bubble($$self, event);
    	}

    	function keypress_handler_13(event) {
    		bubble($$self, event);
    	}

    	function keyup_handler_13(event) {
    		bubble($$self, event);
    	}

    	function change_handler_13(event) {
    		bubble($$self, event);
    	}

    	function input_handler_13(event) {
    		bubble($$self, event);
    	}

    	function blur_handler_14(event) {
    		bubble($$self, event);
    	}

    	function focus_handler_14(event) {
    		bubble($$self, event);
    	}

    	function keydown_handler_14(event) {
    		bubble($$self, event);
    	}

    	function keypress_handler_14(event) {
    		bubble($$self, event);
    	}

    	function keyup_handler_14(event) {
    		bubble($$self, event);
    	}

    	function blur_handler_15(event) {
    		bubble($$self, event);
    	}

    	function focus_handler_15(event) {
    		bubble($$self, event);
    	}

    	function keydown_handler_15(event) {
    		bubble($$self, event);
    	}

    	function keypress_handler_15(event) {
    		bubble($$self, event);
    	}

    	function keyup_handler_15(event) {
    		bubble($$self, event);
    	}

    	function change_handler_14(event) {
    		bubble($$self, event);
    	}

    	function input_handler_14(event) {
    		bubble($$self, event);
    	}

    	function blur_handler_16(event) {
    		bubble($$self, event);
    	}

    	function focus_handler_16(event) {
    		bubble($$self, event);
    	}

    	function change_handler_15(event) {
    		bubble($$self, event);
    	}

    	function input_handler_15(event) {
    		bubble($$self, event);
    	}

    	function blur_handler_17(event) {
    		bubble($$self, event);
    	}

    	function focus_handler_17(event) {
    		bubble($$self, event);
    	}

    	function change_handler_16(event) {
    		bubble($$self, event);
    	}

    	function input_handler_16(event) {
    		bubble($$self, event);
    	}

    	function input_input_handler() {
    		value = this.value;
    		$$invalidate(1, value);
    	}

    	function input_input_handler_1() {
    		value = this.value;
    		$$invalidate(1, value);
    	}

    	function input_input_handler_2() {
    		value = this.value;
    		$$invalidate(1, value);
    	}

    	function input_change_handler() {
    		files = this.files;
    		$$invalidate(2, files);
    	}

    	function input_change_handler_1() {
    		checked = this.checked;
    		value = this.value;
    		$$invalidate(0, checked);
    		$$invalidate(1, value);
    	}

    	function input_change_handler_2() {
    		value = this.value;
    		$$invalidate(1, value);
    	}

    	function input_input_handler_3() {
    		value = this.value;
    		$$invalidate(1, value);
    	}

    	function input_input_handler_4() {
    		value = to_number(this.value);
    		$$invalidate(1, value);
    	}

    	function input_input_handler_5() {
    		value = this.value;
    		$$invalidate(1, value);
    	}

    	function input_input_handler_6() {
    		value = this.value;
    		$$invalidate(1, value);
    	}

    	function input_input_handler_7() {
    		value = this.value;
    		$$invalidate(1, value);
    	}

    	function input_input_handler_8() {
    		value = this.value;
    		$$invalidate(1, value);
    	}

    	function input_change_input_handler() {
    		value = to_number(this.value);
    		$$invalidate(1, value);
    	}

    	function input_input_handler_9() {
    		value = this.value;
    		$$invalidate(1, value);
    	}

    	function textarea_input_handler() {
    		value = this.value;
    		$$invalidate(1, value);
    	}

    	function select_change_handler() {
    		value = select_value(this);
    		$$invalidate(1, value);
    	}

    	function select_change_handler_1() {
    		value = select_multiple_value(this);
    		$$invalidate(1, value);
    	}

    	$$self.$set = $$new_props => {
    		$$invalidate(24, $$props = assign(assign({}, $$props), exclude_internal_props($$new_props)));
    		if ("class" in $$new_props) $$invalidate(16, className = $$new_props.class);
    		if ("type" in $$new_props) $$invalidate(3, type = $$new_props.type);
    		if ("size" in $$new_props) $$invalidate(14, size = $$new_props.size);
    		if ("bsSize" in $$new_props) $$invalidate(15, bsSize = $$new_props.bsSize);
    		if ("color" in $$new_props) $$invalidate(17, color = $$new_props.color);
    		if ("checked" in $$new_props) $$invalidate(0, checked = $$new_props.checked);
    		if ("valid" in $$new_props) $$invalidate(18, valid = $$new_props.valid);
    		if ("invalid" in $$new_props) $$invalidate(19, invalid = $$new_props.invalid);
    		if ("plaintext" in $$new_props) $$invalidate(20, plaintext = $$new_props.plaintext);
    		if ("addon" in $$new_props) $$invalidate(21, addon = $$new_props.addon);
    		if ("value" in $$new_props) $$invalidate(1, value = $$new_props.value);
    		if ("files" in $$new_props) $$invalidate(2, files = $$new_props.files);
    		if ("readonly" in $$new_props) $$invalidate(4, readonly = $$new_props.readonly);
    		if ("multiple" in $$new_props) $$invalidate(5, multiple = $$new_props.multiple);
    		if ("id" in $$new_props) $$invalidate(6, id = $$new_props.id);
    		if ("name" in $$new_props) $$invalidate(7, name = $$new_props.name);
    		if ("placeholder" in $$new_props) $$invalidate(8, placeholder = $$new_props.placeholder);
    		if ("disabled" in $$new_props) $$invalidate(9, disabled = $$new_props.disabled);
    		if ("$$scope" in $$new_props) $$invalidate(25, $$scope = $$new_props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		clsx,
    		clean,
    		className,
    		type,
    		size,
    		bsSize,
    		color,
    		checked,
    		valid,
    		invalid,
    		plaintext,
    		addon,
    		value,
    		files,
    		readonly,
    		multiple,
    		id,
    		name,
    		placeholder,
    		disabled,
    		_omitType,
    		_omitColor,
    		props,
    		classes,
    		tag,
    		handleInput
    	});

    	$$self.$inject_state = $$new_props => {
    		$$invalidate(24, $$props = assign(assign({}, $$props), $$new_props));
    		if ("className" in $$props) $$invalidate(16, className = $$new_props.className);
    		if ("type" in $$props) $$invalidate(3, type = $$new_props.type);
    		if ("size" in $$props) $$invalidate(14, size = $$new_props.size);
    		if ("bsSize" in $$props) $$invalidate(15, bsSize = $$new_props.bsSize);
    		if ("color" in $$props) $$invalidate(17, color = $$new_props.color);
    		if ("checked" in $$props) $$invalidate(0, checked = $$new_props.checked);
    		if ("valid" in $$props) $$invalidate(18, valid = $$new_props.valid);
    		if ("invalid" in $$props) $$invalidate(19, invalid = $$new_props.invalid);
    		if ("plaintext" in $$props) $$invalidate(20, plaintext = $$new_props.plaintext);
    		if ("addon" in $$props) $$invalidate(21, addon = $$new_props.addon);
    		if ("value" in $$props) $$invalidate(1, value = $$new_props.value);
    		if ("files" in $$props) $$invalidate(2, files = $$new_props.files);
    		if ("readonly" in $$props) $$invalidate(4, readonly = $$new_props.readonly);
    		if ("multiple" in $$props) $$invalidate(5, multiple = $$new_props.multiple);
    		if ("id" in $$props) $$invalidate(6, id = $$new_props.id);
    		if ("name" in $$props) $$invalidate(7, name = $$new_props.name);
    		if ("placeholder" in $$props) $$invalidate(8, placeholder = $$new_props.placeholder);
    		if ("disabled" in $$props) $$invalidate(9, disabled = $$new_props.disabled);
    		if ("classes" in $$props) $$invalidate(10, classes = $$new_props.classes);
    		if ("tag" in $$props) $$invalidate(11, tag = $$new_props.tag);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty[0] & /*type, plaintext, addon, color, size, className, invalid, valid, bsSize*/ 4177928) {
    			 {
    				const checkInput = ["radio", "checkbox"].indexOf(type) > -1;
    				const isNotaNumber = new RegExp("\\D", "g");
    				const fileInput = type === "file";
    				const textareaInput = type === "textarea";
    				const rangeInput = type === "range";
    				const selectInput = type === "select";
    				const buttonInput = type === "button" || type === "reset" || type === "submit";
    				const unsupportedInput = type === "hidden" || type === "image";
    				$$invalidate(11, tag = selectInput || textareaInput ? type : "input");
    				let formControlClass = "form-control";

    				if (plaintext) {
    					formControlClass = `${formControlClass}-plaintext`;
    					$$invalidate(11, tag = "input");
    				} else if (fileInput) {
    					formControlClass = `${formControlClass}-file`;
    				} else if (checkInput) {
    					if (addon) {
    						formControlClass = null;
    					} else {
    						formControlClass = "form-check-input";
    					}
    				} else if (buttonInput) {
    					formControlClass = `btn btn-${color || "secondary"}`;
    				} else if (rangeInput) {
    					formControlClass = "form-control-range";
    				} else if (unsupportedInput) {
    					formControlClass = "";
    				}

    				if (size && isNotaNumber.test(size)) {
    					console.warn("Please use the prop \"bsSize\" instead of the \"size\" to bootstrap's input sizing.");
    					$$invalidate(15, bsSize = size);
    					$$invalidate(14, size = undefined);
    				}

    				$$invalidate(10, classes = clsx(className, invalid && "is-invalid", valid && "is-valid", bsSize ? `form-control-${bsSize}` : false, formControlClass));
    			}
    		}
    	};

    	$$props = exclude_internal_props($$props);

    	return [
    		checked,
    		value,
    		files,
    		type,
    		readonly,
    		multiple,
    		id,
    		name,
    		placeholder,
    		disabled,
    		classes,
    		tag,
    		props,
    		handleInput,
    		size,
    		bsSize,
    		className,
    		color,
    		valid,
    		invalid,
    		plaintext,
    		addon,
    		_omitType,
    		_omitColor,
    		$$props,
    		$$scope,
    		$$slots,
    		blur_handler,
    		focus_handler,
    		keydown_handler,
    		keypress_handler,
    		keyup_handler,
    		change_handler,
    		input_handler,
    		blur_handler_1,
    		focus_handler_1,
    		keydown_handler_1,
    		keypress_handler_1,
    		keyup_handler_1,
    		change_handler_1,
    		input_handler_1,
    		blur_handler_2,
    		focus_handler_2,
    		keydown_handler_2,
    		keypress_handler_2,
    		keyup_handler_2,
    		change_handler_2,
    		input_handler_2,
    		blur_handler_3,
    		focus_handler_3,
    		keydown_handler_3,
    		keypress_handler_3,
    		keyup_handler_3,
    		change_handler_3,
    		input_handler_3,
    		blur_handler_4,
    		focus_handler_4,
    		keydown_handler_4,
    		keypress_handler_4,
    		keyup_handler_4,
    		change_handler_4,
    		input_handler_4,
    		blur_handler_5,
    		focus_handler_5,
    		keydown_handler_5,
    		keypress_handler_5,
    		keyup_handler_5,
    		change_handler_5,
    		input_handler_5,
    		blur_handler_6,
    		focus_handler_6,
    		keydown_handler_6,
    		keypress_handler_6,
    		keyup_handler_6,
    		change_handler_6,
    		input_handler_6,
    		blur_handler_7,
    		focus_handler_7,
    		keydown_handler_7,
    		keypress_handler_7,
    		keyup_handler_7,
    		change_handler_7,
    		input_handler_7,
    		blur_handler_8,
    		focus_handler_8,
    		keydown_handler_8,
    		keypress_handler_8,
    		keyup_handler_8,
    		change_handler_8,
    		input_handler_8,
    		blur_handler_9,
    		focus_handler_9,
    		keydown_handler_9,
    		keypress_handler_9,
    		keyup_handler_9,
    		change_handler_9,
    		input_handler_9,
    		blur_handler_10,
    		focus_handler_10,
    		keydown_handler_10,
    		keypress_handler_10,
    		keyup_handler_10,
    		change_handler_10,
    		input_handler_10,
    		blur_handler_11,
    		focus_handler_11,
    		keydown_handler_11,
    		keypress_handler_11,
    		keyup_handler_11,
    		change_handler_11,
    		input_handler_11,
    		blur_handler_12,
    		focus_handler_12,
    		keydown_handler_12,
    		keypress_handler_12,
    		keyup_handler_12,
    		change_handler_12,
    		input_handler_12,
    		blur_handler_13,
    		focus_handler_13,
    		keydown_handler_13,
    		keypress_handler_13,
    		keyup_handler_13,
    		change_handler_13,
    		input_handler_13,
    		blur_handler_14,
    		focus_handler_14,
    		keydown_handler_14,
    		keypress_handler_14,
    		keyup_handler_14,
    		blur_handler_15,
    		focus_handler_15,
    		keydown_handler_15,
    		keypress_handler_15,
    		keyup_handler_15,
    		change_handler_14,
    		input_handler_14,
    		blur_handler_16,
    		focus_handler_16,
    		change_handler_15,
    		input_handler_15,
    		blur_handler_17,
    		focus_handler_17,
    		change_handler_16,
    		input_handler_16,
    		input_input_handler,
    		input_input_handler_1,
    		input_input_handler_2,
    		input_change_handler,
    		input_change_handler_1,
    		input_change_handler_2,
    		input_input_handler_3,
    		input_input_handler_4,
    		input_input_handler_5,
    		input_input_handler_6,
    		input_input_handler_7,
    		input_input_handler_8,
    		input_change_input_handler,
    		input_input_handler_9,
    		textarea_input_handler,
    		select_change_handler,
    		select_change_handler_1
    	];
    }

    class Input extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(
    			this,
    			options,
    			instance$7,
    			create_fragment$7,
    			safe_not_equal,
    			{
    				class: 16,
    				type: 3,
    				size: 14,
    				bsSize: 15,
    				color: 17,
    				checked: 0,
    				valid: 18,
    				invalid: 19,
    				plaintext: 20,
    				addon: 21,
    				value: 1,
    				files: 2,
    				readonly: 4,
    				multiple: 5,
    				id: 6,
    				name: 7,
    				placeholder: 8,
    				disabled: 9
    			},
    			[-1, -1, -1, -1, -1, -1]
    		);

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Input",
    			options,
    			id: create_fragment$7.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*readonly*/ ctx[4] === undefined && !("readonly" in props)) {
    			console_1$1.warn("<Input> was created without expected prop 'readonly'");
    		}
    	}

    	get class() {
    		throw new Error("<Input>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set class(value) {
    		throw new Error("<Input>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get type() {
    		throw new Error("<Input>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set type(value) {
    		throw new Error("<Input>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get size() {
    		throw new Error("<Input>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set size(value) {
    		throw new Error("<Input>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get bsSize() {
    		throw new Error("<Input>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set bsSize(value) {
    		throw new Error("<Input>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get color() {
    		throw new Error("<Input>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set color(value) {
    		throw new Error("<Input>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get checked() {
    		throw new Error("<Input>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set checked(value) {
    		throw new Error("<Input>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get valid() {
    		throw new Error("<Input>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set valid(value) {
    		throw new Error("<Input>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get invalid() {
    		throw new Error("<Input>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set invalid(value) {
    		throw new Error("<Input>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get plaintext() {
    		throw new Error("<Input>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set plaintext(value) {
    		throw new Error("<Input>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get addon() {
    		throw new Error("<Input>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set addon(value) {
    		throw new Error("<Input>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get value() {
    		throw new Error("<Input>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set value(value) {
    		throw new Error("<Input>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get files() {
    		throw new Error("<Input>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set files(value) {
    		throw new Error("<Input>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get readonly() {
    		throw new Error("<Input>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set readonly(value) {
    		throw new Error("<Input>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get multiple() {
    		throw new Error("<Input>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set multiple(value) {
    		throw new Error("<Input>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get id() {
    		throw new Error("<Input>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set id(value) {
    		throw new Error("<Input>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get name() {
    		throw new Error("<Input>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set name(value) {
    		throw new Error("<Input>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get placeholder() {
    		throw new Error("<Input>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set placeholder(value) {
    		throw new Error("<Input>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get disabled() {
    		throw new Error("<Input>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set disabled(value) {
    		throw new Error("<Input>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules\sveltestrap\src\Label.svelte generated by Svelte v3.21.0 */
    const file$5 = "node_modules\\sveltestrap\\src\\Label.svelte";

    function create_fragment$8(ctx) {
    	let label;
    	let current;
    	const default_slot_template = /*$$slots*/ ctx[18].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[17], null);

    	let label_levels = [
    		/*props*/ ctx[3],
    		{ id: /*id*/ ctx[1] },
    		{ class: /*classes*/ ctx[2] },
    		{ for: /*fore*/ ctx[0] }
    	];

    	let label_data = {};

    	for (let i = 0; i < label_levels.length; i += 1) {
    		label_data = assign(label_data, label_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			label = element("label");
    			if (default_slot) default_slot.c();
    			set_attributes(label, label_data);
    			add_location(label, file$5, 73, 0, 1685);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, label, anchor);

    			if (default_slot) {
    				default_slot.m(label, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && dirty & /*$$scope*/ 131072) {
    					default_slot.p(get_slot_context(default_slot_template, ctx, /*$$scope*/ ctx[17], null), get_slot_changes(default_slot_template, /*$$scope*/ ctx[17], dirty, null));
    				}
    			}

    			set_attributes(label, get_spread_update(label_levels, [
    				dirty & /*props*/ 8 && /*props*/ ctx[3],
    				dirty & /*id*/ 2 && { id: /*id*/ ctx[1] },
    				dirty & /*classes*/ 4 && { class: /*classes*/ ctx[2] },
    				dirty & /*fore*/ 1 && { for: /*fore*/ ctx[0] }
    			]));
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(label);
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$8.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$8($$self, $$props, $$invalidate) {
    	let { class: className = "" } = $$props;
    	const props = clean($$props);
    	let { hidden = false } = $$props;
    	let { check = false } = $$props;
    	let { size = "" } = $$props;
    	let { for: fore } = $$props;
    	let { id = "" } = $$props;
    	let { xs = "" } = $$props;
    	let { sm = "" } = $$props;
    	let { md = "" } = $$props;
    	let { lg = "" } = $$props;
    	let { xl = "" } = $$props;
    	const colWidths = { xs, sm, md, lg, xl };
    	let { widths = Object.keys(colWidths) } = $$props;
    	const colClasses = [];

    	widths.forEach(colWidth => {
    		let columnProp = $$props[colWidth];

    		if (!columnProp && columnProp !== "") {
    			return;
    		}

    		const isXs = colWidth === "xs";
    		let colClass;

    		if (isObject(columnProp)) {
    			const colSizeInterfix = isXs ? "-" : `-${colWidth}-`;
    			colClass = getColumnSizeClass(isXs, colWidth, columnProp.size);

    			colClasses.push(clsx({
    				[colClass]: columnProp.size || columnProp.size === "",
    				[`order${colSizeInterfix}${columnProp.order}`]: columnProp.order || columnProp.order === 0,
    				[`offset${colSizeInterfix}${columnProp.offset}`]: columnProp.offset || columnProp.offset === 0
    			}));
    		} else {
    			colClass = getColumnSizeClass(isXs, colWidth, columnProp);
    			colClasses.push(colClass);
    		}
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("Label", $$slots, ['default']);

    	$$self.$set = $$new_props => {
    		$$invalidate(16, $$props = assign(assign({}, $$props), exclude_internal_props($$new_props)));
    		if ("class" in $$new_props) $$invalidate(4, className = $$new_props.class);
    		if ("hidden" in $$new_props) $$invalidate(5, hidden = $$new_props.hidden);
    		if ("check" in $$new_props) $$invalidate(6, check = $$new_props.check);
    		if ("size" in $$new_props) $$invalidate(7, size = $$new_props.size);
    		if ("for" in $$new_props) $$invalidate(0, fore = $$new_props.for);
    		if ("id" in $$new_props) $$invalidate(1, id = $$new_props.id);
    		if ("xs" in $$new_props) $$invalidate(8, xs = $$new_props.xs);
    		if ("sm" in $$new_props) $$invalidate(9, sm = $$new_props.sm);
    		if ("md" in $$new_props) $$invalidate(10, md = $$new_props.md);
    		if ("lg" in $$new_props) $$invalidate(11, lg = $$new_props.lg);
    		if ("xl" in $$new_props) $$invalidate(12, xl = $$new_props.xl);
    		if ("widths" in $$new_props) $$invalidate(13, widths = $$new_props.widths);
    		if ("$$scope" in $$new_props) $$invalidate(17, $$scope = $$new_props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		clsx,
    		clean,
    		getColumnSizeClass,
    		isObject,
    		className,
    		props,
    		hidden,
    		check,
    		size,
    		fore,
    		id,
    		xs,
    		sm,
    		md,
    		lg,
    		xl,
    		colWidths,
    		widths,
    		colClasses,
    		classes
    	});

    	$$self.$inject_state = $$new_props => {
    		$$invalidate(16, $$props = assign(assign({}, $$props), $$new_props));
    		if ("className" in $$props) $$invalidate(4, className = $$new_props.className);
    		if ("hidden" in $$props) $$invalidate(5, hidden = $$new_props.hidden);
    		if ("check" in $$props) $$invalidate(6, check = $$new_props.check);
    		if ("size" in $$props) $$invalidate(7, size = $$new_props.size);
    		if ("fore" in $$props) $$invalidate(0, fore = $$new_props.fore);
    		if ("id" in $$props) $$invalidate(1, id = $$new_props.id);
    		if ("xs" in $$props) $$invalidate(8, xs = $$new_props.xs);
    		if ("sm" in $$props) $$invalidate(9, sm = $$new_props.sm);
    		if ("md" in $$props) $$invalidate(10, md = $$new_props.md);
    		if ("lg" in $$props) $$invalidate(11, lg = $$new_props.lg);
    		if ("xl" in $$props) $$invalidate(12, xl = $$new_props.xl);
    		if ("widths" in $$props) $$invalidate(13, widths = $$new_props.widths);
    		if ("classes" in $$props) $$invalidate(2, classes = $$new_props.classes);
    	};

    	let classes;

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*className, hidden, check, size*/ 240) {
    			 $$invalidate(2, classes = clsx(className, hidden ? "sr-only" : false, check ? "form-check-label" : false, size ? `col-form-label-${size}` : false, colClasses, colClasses.length ? "col-form-label" : false));
    		}
    	};

    	$$props = exclude_internal_props($$props);

    	return [
    		fore,
    		id,
    		classes,
    		props,
    		className,
    		hidden,
    		check,
    		size,
    		xs,
    		sm,
    		md,
    		lg,
    		xl,
    		widths,
    		colWidths,
    		colClasses,
    		$$props,
    		$$scope,
    		$$slots
    	];
    }

    class Label extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$8, create_fragment$8, safe_not_equal, {
    			class: 4,
    			hidden: 5,
    			check: 6,
    			size: 7,
    			for: 0,
    			id: 1,
    			xs: 8,
    			sm: 9,
    			md: 10,
    			lg: 11,
    			xl: 12,
    			widths: 13
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Label",
    			options,
    			id: create_fragment$8.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*fore*/ ctx[0] === undefined && !("for" in props)) {
    			console.warn("<Label> was created without expected prop 'for'");
    		}
    	}

    	get class() {
    		throw new Error("<Label>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set class(value) {
    		throw new Error("<Label>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get hidden() {
    		throw new Error("<Label>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set hidden(value) {
    		throw new Error("<Label>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get check() {
    		throw new Error("<Label>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set check(value) {
    		throw new Error("<Label>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get size() {
    		throw new Error("<Label>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set size(value) {
    		throw new Error("<Label>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get for() {
    		throw new Error("<Label>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set for(value) {
    		throw new Error("<Label>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get id() {
    		throw new Error("<Label>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set id(value) {
    		throw new Error("<Label>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get xs() {
    		throw new Error("<Label>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set xs(value) {
    		throw new Error("<Label>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get sm() {
    		throw new Error("<Label>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set sm(value) {
    		throw new Error("<Label>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get md() {
    		throw new Error("<Label>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set md(value) {
    		throw new Error("<Label>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get lg() {
    		throw new Error("<Label>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set lg(value) {
    		throw new Error("<Label>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get xl() {
    		throw new Error("<Label>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set xl(value) {
    		throw new Error("<Label>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get widths() {
    		throw new Error("<Label>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set widths(value) {
    		throw new Error("<Label>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules\sveltestrap\src\FormGroup.svelte generated by Svelte v3.21.0 */
    const file$6 = "node_modules\\sveltestrap\\src\\FormGroup.svelte";

    // (29:0) {:else}
    function create_else_block$4(ctx) {
    	let div;
    	let current;
    	const default_slot_template = /*$$slots*/ ctx[11].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[10], null);
    	let div_levels = [/*props*/ ctx[3], { id: /*id*/ ctx[0] }, { class: /*classes*/ ctx[2] }];
    	let div_data = {};

    	for (let i = 0; i < div_levels.length; i += 1) {
    		div_data = assign(div_data, div_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			div = element("div");
    			if (default_slot) default_slot.c();
    			set_attributes(div, div_data);
    			add_location(div, file$6, 29, 2, 648);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			if (default_slot) {
    				default_slot.m(div, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && dirty & /*$$scope*/ 1024) {
    					default_slot.p(get_slot_context(default_slot_template, ctx, /*$$scope*/ ctx[10], null), get_slot_changes(default_slot_template, /*$$scope*/ ctx[10], dirty, null));
    				}
    			}

    			set_attributes(div, get_spread_update(div_levels, [
    				dirty & /*props*/ 8 && /*props*/ ctx[3],
    				dirty & /*id*/ 1 && { id: /*id*/ ctx[0] },
    				dirty & /*classes*/ 4 && { class: /*classes*/ ctx[2] }
    			]));
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$4.name,
    		type: "else",
    		source: "(29:0) {:else}",
    		ctx
    	});

    	return block;
    }

    // (25:0) {#if tag === 'fieldset'}
    function create_if_block$4(ctx) {
    	let fieldset;
    	let current;
    	const default_slot_template = /*$$slots*/ ctx[11].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[10], null);
    	let fieldset_levels = [/*props*/ ctx[3], { id: /*id*/ ctx[0] }, { class: /*classes*/ ctx[2] }];
    	let fieldset_data = {};

    	for (let i = 0; i < fieldset_levels.length; i += 1) {
    		fieldset_data = assign(fieldset_data, fieldset_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			fieldset = element("fieldset");
    			if (default_slot) default_slot.c();
    			set_attributes(fieldset, fieldset_data);
    			add_location(fieldset, file$6, 25, 2, 568);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, fieldset, anchor);

    			if (default_slot) {
    				default_slot.m(fieldset, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && dirty & /*$$scope*/ 1024) {
    					default_slot.p(get_slot_context(default_slot_template, ctx, /*$$scope*/ ctx[10], null), get_slot_changes(default_slot_template, /*$$scope*/ ctx[10], dirty, null));
    				}
    			}

    			set_attributes(fieldset, get_spread_update(fieldset_levels, [
    				dirty & /*props*/ 8 && /*props*/ ctx[3],
    				dirty & /*id*/ 1 && { id: /*id*/ ctx[0] },
    				dirty & /*classes*/ 4 && { class: /*classes*/ ctx[2] }
    			]));
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(fieldset);
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$4.name,
    		type: "if",
    		source: "(25:0) {#if tag === 'fieldset'}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$9(ctx) {
    	let current_block_type_index;
    	let if_block;
    	let if_block_anchor;
    	let current;
    	const if_block_creators = [create_if_block$4, create_else_block$4];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*tag*/ ctx[1] === "fieldset") return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if_blocks[current_block_type_index].m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				}

    				transition_in(if_block, 1);
    				if_block.m(if_block_anchor.parentNode, if_block_anchor);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if_blocks[current_block_type_index].d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$9.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$9($$self, $$props, $$invalidate) {
    	let { class: className = "" } = $$props;
    	let { row = false } = $$props;
    	let { check = false } = $$props;
    	let { inline = false } = $$props;
    	let { disabled = false } = $$props;
    	let { id = "" } = $$props;
    	let { tag = null } = $$props;
    	const props = clean($$props);
    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("FormGroup", $$slots, ['default']);

    	$$self.$set = $$new_props => {
    		$$invalidate(9, $$props = assign(assign({}, $$props), exclude_internal_props($$new_props)));
    		if ("class" in $$new_props) $$invalidate(4, className = $$new_props.class);
    		if ("row" in $$new_props) $$invalidate(5, row = $$new_props.row);
    		if ("check" in $$new_props) $$invalidate(6, check = $$new_props.check);
    		if ("inline" in $$new_props) $$invalidate(7, inline = $$new_props.inline);
    		if ("disabled" in $$new_props) $$invalidate(8, disabled = $$new_props.disabled);
    		if ("id" in $$new_props) $$invalidate(0, id = $$new_props.id);
    		if ("tag" in $$new_props) $$invalidate(1, tag = $$new_props.tag);
    		if ("$$scope" in $$new_props) $$invalidate(10, $$scope = $$new_props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		clsx,
    		clean,
    		className,
    		row,
    		check,
    		inline,
    		disabled,
    		id,
    		tag,
    		props,
    		classes
    	});

    	$$self.$inject_state = $$new_props => {
    		$$invalidate(9, $$props = assign(assign({}, $$props), $$new_props));
    		if ("className" in $$props) $$invalidate(4, className = $$new_props.className);
    		if ("row" in $$props) $$invalidate(5, row = $$new_props.row);
    		if ("check" in $$props) $$invalidate(6, check = $$new_props.check);
    		if ("inline" in $$props) $$invalidate(7, inline = $$new_props.inline);
    		if ("disabled" in $$props) $$invalidate(8, disabled = $$new_props.disabled);
    		if ("id" in $$props) $$invalidate(0, id = $$new_props.id);
    		if ("tag" in $$props) $$invalidate(1, tag = $$new_props.tag);
    		if ("classes" in $$props) $$invalidate(2, classes = $$new_props.classes);
    	};

    	let classes;

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*className, row, check, inline, disabled*/ 496) {
    			 $$invalidate(2, classes = clsx(className, row ? "row" : false, check ? "form-check" : "form-group", check && inline ? "form-check-inline" : false, check && disabled ? "disabled" : false));
    		}
    	};

    	$$props = exclude_internal_props($$props);

    	return [
    		id,
    		tag,
    		classes,
    		props,
    		className,
    		row,
    		check,
    		inline,
    		disabled,
    		$$props,
    		$$scope,
    		$$slots
    	];
    }

    class FormGroup extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$9, create_fragment$9, safe_not_equal, {
    			class: 4,
    			row: 5,
    			check: 6,
    			inline: 7,
    			disabled: 8,
    			id: 0,
    			tag: 1
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "FormGroup",
    			options,
    			id: create_fragment$9.name
    		});
    	}

    	get class() {
    		throw new Error("<FormGroup>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set class(value) {
    		throw new Error("<FormGroup>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get row() {
    		throw new Error("<FormGroup>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set row(value) {
    		throw new Error("<FormGroup>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get check() {
    		throw new Error("<FormGroup>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set check(value) {
    		throw new Error("<FormGroup>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get inline() {
    		throw new Error("<FormGroup>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set inline(value) {
    		throw new Error("<FormGroup>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get disabled() {
    		throw new Error("<FormGroup>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set disabled(value) {
    		throw new Error("<FormGroup>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get id() {
    		throw new Error("<FormGroup>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set id(value) {
    		throw new Error("<FormGroup>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get tag() {
    		throw new Error("<FormGroup>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set tag(value) {
    		throw new Error("<FormGroup>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules\sveltestrap\src\Pagination.svelte generated by Svelte v3.21.0 */
    const file$7 = "node_modules\\sveltestrap\\src\\Pagination.svelte";

    function create_fragment$a(ctx) {
    	let nav;
    	let ul;
    	let current;
    	const default_slot_template = /*$$slots*/ ctx[9].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[8], null);

    	let nav_levels = [
    		/*props*/ ctx[3],
    		{ class: /*classes*/ ctx[1] },
    		{ "aria-label": /*ariaLabel*/ ctx[0] }
    	];

    	let nav_data = {};

    	for (let i = 0; i < nav_levels.length; i += 1) {
    		nav_data = assign(nav_data, nav_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			nav = element("nav");
    			ul = element("ul");
    			if (default_slot) default_slot.c();
    			attr_dev(ul, "class", /*listClasses*/ ctx[2]);
    			add_location(ul, file$7, 20, 2, 455);
    			set_attributes(nav, nav_data);
    			add_location(nav, file$7, 19, 0, 397);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, nav, anchor);
    			append_dev(nav, ul);

    			if (default_slot) {
    				default_slot.m(ul, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && dirty & /*$$scope*/ 256) {
    					default_slot.p(get_slot_context(default_slot_template, ctx, /*$$scope*/ ctx[8], null), get_slot_changes(default_slot_template, /*$$scope*/ ctx[8], dirty, null));
    				}
    			}

    			if (!current || dirty & /*listClasses*/ 4) {
    				attr_dev(ul, "class", /*listClasses*/ ctx[2]);
    			}

    			set_attributes(nav, get_spread_update(nav_levels, [
    				dirty & /*props*/ 8 && /*props*/ ctx[3],
    				dirty & /*classes*/ 2 && { class: /*classes*/ ctx[1] },
    				dirty & /*ariaLabel*/ 1 && { "aria-label": /*ariaLabel*/ ctx[0] }
    			]));
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(nav);
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$a.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$a($$self, $$props, $$invalidate) {
    	let { class: className = "" } = $$props;
    	let { listClassName = "" } = $$props;
    	let { size = "" } = $$props;
    	let { ariaLabel = "pagination" } = $$props;
    	const props = clean($$props);
    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("Pagination", $$slots, ['default']);

    	$$self.$set = $$new_props => {
    		$$invalidate(7, $$props = assign(assign({}, $$props), exclude_internal_props($$new_props)));
    		if ("class" in $$new_props) $$invalidate(4, className = $$new_props.class);
    		if ("listClassName" in $$new_props) $$invalidate(5, listClassName = $$new_props.listClassName);
    		if ("size" in $$new_props) $$invalidate(6, size = $$new_props.size);
    		if ("ariaLabel" in $$new_props) $$invalidate(0, ariaLabel = $$new_props.ariaLabel);
    		if ("$$scope" in $$new_props) $$invalidate(8, $$scope = $$new_props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		clsx,
    		clean,
    		className,
    		listClassName,
    		size,
    		ariaLabel,
    		props,
    		classes,
    		listClasses
    	});

    	$$self.$inject_state = $$new_props => {
    		$$invalidate(7, $$props = assign(assign({}, $$props), $$new_props));
    		if ("className" in $$props) $$invalidate(4, className = $$new_props.className);
    		if ("listClassName" in $$props) $$invalidate(5, listClassName = $$new_props.listClassName);
    		if ("size" in $$props) $$invalidate(6, size = $$new_props.size);
    		if ("ariaLabel" in $$props) $$invalidate(0, ariaLabel = $$new_props.ariaLabel);
    		if ("classes" in $$props) $$invalidate(1, classes = $$new_props.classes);
    		if ("listClasses" in $$props) $$invalidate(2, listClasses = $$new_props.listClasses);
    	};

    	let classes;
    	let listClasses;

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*className*/ 16) {
    			 $$invalidate(1, classes = clsx(className));
    		}

    		if ($$self.$$.dirty & /*listClassName, size*/ 96) {
    			 $$invalidate(2, listClasses = clsx(listClassName, "pagination", { [`pagination-${size}`]: !!size }));
    		}
    	};

    	$$props = exclude_internal_props($$props);

    	return [
    		ariaLabel,
    		classes,
    		listClasses,
    		props,
    		className,
    		listClassName,
    		size,
    		$$props,
    		$$scope,
    		$$slots
    	];
    }

    class Pagination extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$a, create_fragment$a, safe_not_equal, {
    			class: 4,
    			listClassName: 5,
    			size: 6,
    			ariaLabel: 0
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Pagination",
    			options,
    			id: create_fragment$a.name
    		});
    	}

    	get class() {
    		throw new Error("<Pagination>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set class(value) {
    		throw new Error("<Pagination>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get listClassName() {
    		throw new Error("<Pagination>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set listClassName(value) {
    		throw new Error("<Pagination>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get size() {
    		throw new Error("<Pagination>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set size(value) {
    		throw new Error("<Pagination>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get ariaLabel() {
    		throw new Error("<Pagination>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set ariaLabel(value) {
    		throw new Error("<Pagination>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules\sveltestrap\src\PaginationItem.svelte generated by Svelte v3.21.0 */
    const file$8 = "node_modules\\sveltestrap\\src\\PaginationItem.svelte";

    function create_fragment$b(ctx) {
    	let li;
    	let current;
    	const default_slot_template = /*$$slots*/ ctx[7].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[6], null);
    	let li_levels = [/*props*/ ctx[1], { class: /*classes*/ ctx[0] }];
    	let li_data = {};

    	for (let i = 0; i < li_levels.length; i += 1) {
    		li_data = assign(li_data, li_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			li = element("li");
    			if (default_slot) default_slot.c();
    			set_attributes(li, li_data);
    			add_location(li, file$8, 17, 0, 309);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, li, anchor);

    			if (default_slot) {
    				default_slot.m(li, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && dirty & /*$$scope*/ 64) {
    					default_slot.p(get_slot_context(default_slot_template, ctx, /*$$scope*/ ctx[6], null), get_slot_changes(default_slot_template, /*$$scope*/ ctx[6], dirty, null));
    				}
    			}

    			set_attributes(li, get_spread_update(li_levels, [
    				dirty & /*props*/ 2 && /*props*/ ctx[1],
    				dirty & /*classes*/ 1 && { class: /*classes*/ ctx[0] }
    			]));
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(li);
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$b.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$b($$self, $$props, $$invalidate) {
    	let { class: className = "" } = $$props;
    	let { active = false } = $$props;
    	let { disabled = false } = $$props;
    	const props = clean($$props);
    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("PaginationItem", $$slots, ['default']);

    	$$self.$set = $$new_props => {
    		$$invalidate(5, $$props = assign(assign({}, $$props), exclude_internal_props($$new_props)));
    		if ("class" in $$new_props) $$invalidate(2, className = $$new_props.class);
    		if ("active" in $$new_props) $$invalidate(3, active = $$new_props.active);
    		if ("disabled" in $$new_props) $$invalidate(4, disabled = $$new_props.disabled);
    		if ("$$scope" in $$new_props) $$invalidate(6, $$scope = $$new_props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		clsx,
    		clean,
    		className,
    		active,
    		disabled,
    		props,
    		classes
    	});

    	$$self.$inject_state = $$new_props => {
    		$$invalidate(5, $$props = assign(assign({}, $$props), $$new_props));
    		if ("className" in $$props) $$invalidate(2, className = $$new_props.className);
    		if ("active" in $$props) $$invalidate(3, active = $$new_props.active);
    		if ("disabled" in $$props) $$invalidate(4, disabled = $$new_props.disabled);
    		if ("classes" in $$props) $$invalidate(0, classes = $$new_props.classes);
    	};

    	let classes;

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*className, active, disabled*/ 28) {
    			 $$invalidate(0, classes = clsx(className, "page-item", { active, disabled }));
    		}
    	};

    	$$props = exclude_internal_props($$props);
    	return [classes, props, className, active, disabled, $$props, $$scope, $$slots];
    }

    class PaginationItem extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$b, create_fragment$b, safe_not_equal, { class: 2, active: 3, disabled: 4 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "PaginationItem",
    			options,
    			id: create_fragment$b.name
    		});
    	}

    	get class() {
    		throw new Error("<PaginationItem>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set class(value) {
    		throw new Error("<PaginationItem>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get active() {
    		throw new Error("<PaginationItem>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set active(value) {
    		throw new Error("<PaginationItem>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get disabled() {
    		throw new Error("<PaginationItem>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set disabled(value) {
    		throw new Error("<PaginationItem>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules\sveltestrap\src\PaginationLink.svelte generated by Svelte v3.21.0 */
    const file$9 = "node_modules\\sveltestrap\\src\\PaginationLink.svelte";

    // (50:2) {:else}
    function create_else_block$5(ctx) {
    	let current;
    	const default_slot_template = /*$$slots*/ ctx[14].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[13], null);

    	const block = {
    		c: function create() {
    			if (default_slot) default_slot.c();
    		},
    		m: function mount(target, anchor) {
    			if (default_slot) {
    				default_slot.m(target, anchor);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && dirty & /*$$scope*/ 8192) {
    					default_slot.p(get_slot_context(default_slot_template, ctx, /*$$scope*/ ctx[13], null), get_slot_changes(default_slot_template, /*$$scope*/ ctx[13], dirty, null));
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$5.name,
    		type: "else",
    		source: "(50:2) {:else}",
    		ctx
    	});

    	return block;
    }

    // (45:2) {#if previous || next || first || last}
    function create_if_block$5(ctx) {
    	let span0;
    	let t0;
    	let span1;
    	let t1;
    	let current;
    	const default_slot_template = /*$$slots*/ ctx[14].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[13], null);
    	const default_slot_or_fallback = default_slot || fallback_block$1(ctx);

    	const block = {
    		c: function create() {
    			span0 = element("span");
    			if (default_slot_or_fallback) default_slot_or_fallback.c();
    			t0 = space();
    			span1 = element("span");
    			t1 = text(/*realLabel*/ ctx[7]);
    			attr_dev(span0, "aria-hidden", "true");
    			add_location(span0, file$9, 45, 4, 995);
    			attr_dev(span1, "class", "sr-only");
    			add_location(span1, file$9, 48, 4, 1073);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, span0, anchor);

    			if (default_slot_or_fallback) {
    				default_slot_or_fallback.m(span0, null);
    			}

    			insert_dev(target, t0, anchor);
    			insert_dev(target, span1, anchor);
    			append_dev(span1, t1);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && dirty & /*$$scope*/ 8192) {
    					default_slot.p(get_slot_context(default_slot_template, ctx, /*$$scope*/ ctx[13], null), get_slot_changes(default_slot_template, /*$$scope*/ ctx[13], dirty, null));
    				}
    			} else {
    				if (default_slot_or_fallback && default_slot_or_fallback.p && dirty & /*defaultCaret*/ 32) {
    					default_slot_or_fallback.p(ctx, dirty);
    				}
    			}

    			if (!current || dirty & /*realLabel*/ 128) set_data_dev(t1, /*realLabel*/ ctx[7]);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot_or_fallback, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot_or_fallback, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(span0);
    			if (default_slot_or_fallback) default_slot_or_fallback.d(detaching);
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(span1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$5.name,
    		type: "if",
    		source: "(45:2) {#if previous || next || first || last}",
    		ctx
    	});

    	return block;
    }

    // (47:12)  
    function fallback_block$1(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text(/*defaultCaret*/ ctx[5]);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*defaultCaret*/ 32) set_data_dev(t, /*defaultCaret*/ ctx[5]);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: fallback_block$1.name,
    		type: "fallback",
    		source: "(47:12)  ",
    		ctx
    	});

    	return block;
    }

    function create_fragment$c(ctx) {
    	let a;
    	let current_block_type_index;
    	let if_block;
    	let current;
    	let dispose;
    	const if_block_creators = [create_if_block$5, create_else_block$5];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*previous*/ ctx[1] || /*next*/ ctx[0] || /*first*/ ctx[2] || /*last*/ ctx[3]) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    	let a_levels = [/*props*/ ctx[8], { class: /*classes*/ ctx[6] }, { href: /*href*/ ctx[4] }];
    	let a_data = {};

    	for (let i = 0; i < a_levels.length; i += 1) {
    		a_data = assign(a_data, a_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			a = element("a");
    			if_block.c();
    			set_attributes(a, a_data);
    			add_location(a, file$9, 43, 0, 902);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor, remount) {
    			insert_dev(target, a, anchor);
    			if_blocks[current_block_type_index].m(a, null);
    			current = true;
    			if (remount) dispose();
    			dispose = listen_dev(a, "click", /*click_handler*/ ctx[15], false, false, false);
    		},
    		p: function update(ctx, [dirty]) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				}

    				transition_in(if_block, 1);
    				if_block.m(a, null);
    			}

    			set_attributes(a, get_spread_update(a_levels, [
    				dirty & /*props*/ 256 && /*props*/ ctx[8],
    				dirty & /*classes*/ 64 && { class: /*classes*/ ctx[6] },
    				dirty & /*href*/ 16 && { href: /*href*/ ctx[4] }
    			]));
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(a);
    			if_blocks[current_block_type_index].d();
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$c.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$c($$self, $$props, $$invalidate) {
    	let { class: className = "" } = $$props;
    	let { next = false } = $$props;
    	let { previous = false } = $$props;
    	let { first = false } = $$props;
    	let { last = false } = $$props;
    	let { ariaLabel = "" } = $$props;
    	let { href = "" } = $$props;
    	const props = clean($$props);
    	let defaultAriaLabel;
    	let defaultCaret;
    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("PaginationLink", $$slots, ['default']);

    	function click_handler(event) {
    		bubble($$self, event);
    	}

    	$$self.$set = $$new_props => {
    		$$invalidate(12, $$props = assign(assign({}, $$props), exclude_internal_props($$new_props)));
    		if ("class" in $$new_props) $$invalidate(9, className = $$new_props.class);
    		if ("next" in $$new_props) $$invalidate(0, next = $$new_props.next);
    		if ("previous" in $$new_props) $$invalidate(1, previous = $$new_props.previous);
    		if ("first" in $$new_props) $$invalidate(2, first = $$new_props.first);
    		if ("last" in $$new_props) $$invalidate(3, last = $$new_props.last);
    		if ("ariaLabel" in $$new_props) $$invalidate(10, ariaLabel = $$new_props.ariaLabel);
    		if ("href" in $$new_props) $$invalidate(4, href = $$new_props.href);
    		if ("$$scope" in $$new_props) $$invalidate(13, $$scope = $$new_props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		clsx,
    		clean,
    		className,
    		next,
    		previous,
    		first,
    		last,
    		ariaLabel,
    		href,
    		props,
    		defaultAriaLabel,
    		defaultCaret,
    		classes,
    		realLabel
    	});

    	$$self.$inject_state = $$new_props => {
    		$$invalidate(12, $$props = assign(assign({}, $$props), $$new_props));
    		if ("className" in $$props) $$invalidate(9, className = $$new_props.className);
    		if ("next" in $$props) $$invalidate(0, next = $$new_props.next);
    		if ("previous" in $$props) $$invalidate(1, previous = $$new_props.previous);
    		if ("first" in $$props) $$invalidate(2, first = $$new_props.first);
    		if ("last" in $$props) $$invalidate(3, last = $$new_props.last);
    		if ("ariaLabel" in $$props) $$invalidate(10, ariaLabel = $$new_props.ariaLabel);
    		if ("href" in $$props) $$invalidate(4, href = $$new_props.href);
    		if ("defaultAriaLabel" in $$props) $$invalidate(11, defaultAriaLabel = $$new_props.defaultAriaLabel);
    		if ("defaultCaret" in $$props) $$invalidate(5, defaultCaret = $$new_props.defaultCaret);
    		if ("classes" in $$props) $$invalidate(6, classes = $$new_props.classes);
    		if ("realLabel" in $$props) $$invalidate(7, realLabel = $$new_props.realLabel);
    	};

    	let classes;
    	let realLabel;

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*className*/ 512) {
    			 $$invalidate(6, classes = clsx(className, "page-link"));
    		}

    		if ($$self.$$.dirty & /*previous, next, first, last*/ 15) {
    			 if (previous) {
    				$$invalidate(11, defaultAriaLabel = "Previous");
    			} else if (next) {
    				$$invalidate(11, defaultAriaLabel = "Next");
    			} else if (first) {
    				$$invalidate(11, defaultAriaLabel = "First");
    			} else if (last) {
    				$$invalidate(11, defaultAriaLabel = "Last");
    			}
    		}

    		if ($$self.$$.dirty & /*ariaLabel, defaultAriaLabel*/ 3072) {
    			 $$invalidate(7, realLabel = ariaLabel || defaultAriaLabel);
    		}

    		if ($$self.$$.dirty & /*previous, next, first, last*/ 15) {
    			 if (previous) {
    				$$invalidate(5, defaultCaret = "‹");
    			} else if (next) {
    				$$invalidate(5, defaultCaret = "›");
    			} else if (first) {
    				$$invalidate(5, defaultCaret = "«");
    			} else if (last) {
    				$$invalidate(5, defaultCaret = "»");
    			}
    		}
    	};

    	$$props = exclude_internal_props($$props);

    	return [
    		next,
    		previous,
    		first,
    		last,
    		href,
    		defaultCaret,
    		classes,
    		realLabel,
    		props,
    		className,
    		ariaLabel,
    		defaultAriaLabel,
    		$$props,
    		$$scope,
    		$$slots,
    		click_handler
    	];
    }

    class PaginationLink extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$c, create_fragment$c, safe_not_equal, {
    			class: 9,
    			next: 0,
    			previous: 1,
    			first: 2,
    			last: 3,
    			ariaLabel: 10,
    			href: 4
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "PaginationLink",
    			options,
    			id: create_fragment$c.name
    		});
    	}

    	get class() {
    		throw new Error("<PaginationLink>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set class(value) {
    		throw new Error("<PaginationLink>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get next() {
    		throw new Error("<PaginationLink>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set next(value) {
    		throw new Error("<PaginationLink>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get previous() {
    		throw new Error("<PaginationLink>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set previous(value) {
    		throw new Error("<PaginationLink>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get first() {
    		throw new Error("<PaginationLink>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set first(value) {
    		throw new Error("<PaginationLink>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get last() {
    		throw new Error("<PaginationLink>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set last(value) {
    		throw new Error("<PaginationLink>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get ariaLabel() {
    		throw new Error("<PaginationLink>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set ariaLabel(value) {
    		throw new Error("<PaginationLink>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get href() {
    		throw new Error("<PaginationLink>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set href(value) {
    		throw new Error("<PaginationLink>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\front\routesAPI\CyclingRoutesTable.svelte generated by Svelte v3.21.0 */

    const { console: console_1$2 } = globals;
    const file$a = "src\\front\\routesAPI\\CyclingRoutesTable.svelte";

    function get_each_context(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[31] = list[i];
    	return child_ctx;
    }

    // (1:0) <script>   import {onMount}
    function create_catch_block(ctx) {
    	const block = {
    		c: noop,
    		m: noop,
    		p: noop,
    		i: noop,
    		o: noop,
    		d: noop
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_catch_block.name,
    		type: "catch",
    		source: "(1:0) <script>   import {onMount}",
    		ctx
    	});

    	return block;
    }

    // (189:1) {:then routes}
    function create_then_block(ctx) {
    	let t0;
    	let t1;
    	let h4;
    	let t3;
    	let current;

    	const formgroup = new FormGroup({
    			props: {
    				$$slots: { default: [create_default_slot_16] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const table0 = new Table({
    			props: {
    				bordered: true,
    				$$slots: { default: [create_default_slot_14] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const table1 = new Table({
    			props: {
    				style: "background-color:#EAEEF0;",
    				$$slots: { default: [create_default_slot_12] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(formgroup.$$.fragment);
    			t0 = space();
    			create_component(table0.$$.fragment);
    			t1 = space();
    			h4 = element("h4");
    			h4.textContent = "Introducir nuevo dato:";
    			t3 = space();
    			create_component(table1.$$.fragment);
    			add_location(h4, file$a, 268, 2, 7930);
    		},
    		m: function mount(target, anchor) {
    			mount_component(formgroup, target, anchor);
    			insert_dev(target, t0, anchor);
    			mount_component(table0, target, anchor);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, h4, anchor);
    			insert_dev(target, t3, anchor);
    			mount_component(table1, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const formgroup_changes = {};

    			if (dirty[0] & /*campo1, valor1, campo2, valor2*/ 30 | dirty[1] & /*$$scope*/ 8) {
    				formgroup_changes.$$scope = { dirty, ctx };
    			}

    			formgroup.$set(formgroup_changes);
    			const table0_changes = {};

    			if (dirty[0] & /*routes*/ 256 | dirty[1] & /*$$scope*/ 8) {
    				table0_changes.$$scope = { dirty, ctx };
    			}

    			table0.$set(table0_changes);
    			const table1_changes = {};

    			if (dirty[0] & /*newRoute*/ 1 | dirty[1] & /*$$scope*/ 8) {
    				table1_changes.$$scope = { dirty, ctx };
    			}

    			table1.$set(table1_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(formgroup.$$.fragment, local);
    			transition_in(table0.$$.fragment, local);
    			transition_in(table1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(formgroup.$$.fragment, local);
    			transition_out(table0.$$.fragment, local);
    			transition_out(table1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(formgroup, detaching);
    			if (detaching) detach_dev(t0);
    			destroy_component(table0, detaching);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(h4);
    			if (detaching) detach_dev(t3);
    			destroy_component(table1, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_then_block.name,
    		type: "then",
    		source: "(189:1) {:then routes}",
    		ctx
    	});

    	return block;
    }

    // (204:6) <Input type="select" name="inputCampo" id="inputCampo" bind:value="{campo1}">
    function create_default_slot_19(ctx) {
    	let option0;
    	let t0;
    	let option1;
    	let t2;
    	let option2;
    	let t4;
    	let option3;
    	let t6;
    	let option4;
    	let t8;
    	let option5;

    	const block = {
    		c: function create() {
    			option0 = element("option");
    			t0 = space();
    			option1 = element("option");
    			option1.textContent = "Provincia";
    			t2 = space();
    			option2 = element("option");
    			option2.textContent = "Año";
    			t4 = space();
    			option3 = element("option");
    			option3.textContent = "Metropolitano";
    			t6 = space();
    			option4 = element("option");
    			option4.textContent = "Urbano";
    			t8 = space();
    			option5 = element("option");
    			option5.textContent = "Resto";
    			option0.disabled = true;
    			option0.selected = true;
    			option0.__value = "";
    			option0.value = option0.__value;
    			add_location(option0, file$a, 204, 7, 5961);
    			option1.__value = "province";
    			option1.value = option1.__value;
    			add_location(option1, file$a, 205, 7, 6005);
    			option2.__value = "year";
    			option2.value = option2.__value;
    			add_location(option2, file$a, 206, 7, 6057);
    			option3.__value = "metropolitan";
    			option3.value = option3.__value;
    			add_location(option3, file$a, 207, 7, 6099);
    			option4.__value = "urban";
    			option4.value = option4.__value;
    			add_location(option4, file$a, 208, 7, 6159);
    			option5.__value = "rest";
    			option5.value = option5.__value;
    			add_location(option5, file$a, 209, 7, 6205);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, option0, anchor);
    			insert_dev(target, t0, anchor);
    			insert_dev(target, option1, anchor);
    			insert_dev(target, t2, anchor);
    			insert_dev(target, option2, anchor);
    			insert_dev(target, t4, anchor);
    			insert_dev(target, option3, anchor);
    			insert_dev(target, t6, anchor);
    			insert_dev(target, option4, anchor);
    			insert_dev(target, t8, anchor);
    			insert_dev(target, option5, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(option0);
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(option1);
    			if (detaching) detach_dev(t2);
    			if (detaching) detach_dev(option2);
    			if (detaching) detach_dev(t4);
    			if (detaching) detach_dev(option3);
    			if (detaching) detach_dev(t6);
    			if (detaching) detach_dev(option4);
    			if (detaching) detach_dev(t8);
    			if (detaching) detach_dev(option5);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_19.name,
    		type: "slot",
    		source: "(204:6) <Input type=\\\"select\\\" name=\\\"inputCampo\\\" id=\\\"inputCampo\\\" bind:value=\\\"{campo1}\\\">",
    		ctx
    	});

    	return block;
    }

    // (217:6) <Input type="select" name="inputCampo" id="inputCampo" bind:value="{campo2}">
    function create_default_slot_18(ctx) {
    	let option0;
    	let t0;
    	let option1;
    	let t2;
    	let option2;
    	let t4;
    	let option3;
    	let t6;
    	let option4;
    	let t8;
    	let option5;

    	const block = {
    		c: function create() {
    			option0 = element("option");
    			t0 = space();
    			option1 = element("option");
    			option1.textContent = "Provincia";
    			t2 = space();
    			option2 = element("option");
    			option2.textContent = "Año";
    			t4 = space();
    			option3 = element("option");
    			option3.textContent = "Metropolitano";
    			t6 = space();
    			option4 = element("option");
    			option4.textContent = "Urbano";
    			t8 = space();
    			option5 = element("option");
    			option5.textContent = "Resto";
    			option0.disabled = true;
    			option0.selected = true;
    			option0.__value = "";
    			option0.value = option0.__value;
    			add_location(option0, file$a, 217, 7, 6488);
    			option1.__value = "province";
    			option1.value = option1.__value;
    			add_location(option1, file$a, 218, 7, 6532);
    			option2.__value = "year";
    			option2.value = option2.__value;
    			add_location(option2, file$a, 219, 7, 6584);
    			option3.__value = "metropolitan";
    			option3.value = option3.__value;
    			add_location(option3, file$a, 220, 7, 6626);
    			option4.__value = "urban";
    			option4.value = option4.__value;
    			add_location(option4, file$a, 221, 7, 6686);
    			option5.__value = "rest";
    			option5.value = option5.__value;
    			add_location(option5, file$a, 222, 7, 6732);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, option0, anchor);
    			insert_dev(target, t0, anchor);
    			insert_dev(target, option1, anchor);
    			insert_dev(target, t2, anchor);
    			insert_dev(target, option2, anchor);
    			insert_dev(target, t4, anchor);
    			insert_dev(target, option3, anchor);
    			insert_dev(target, t6, anchor);
    			insert_dev(target, option4, anchor);
    			insert_dev(target, t8, anchor);
    			insert_dev(target, option5, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(option0);
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(option1);
    			if (detaching) detach_dev(t2);
    			if (detaching) detach_dev(option2);
    			if (detaching) detach_dev(t4);
    			if (detaching) detach_dev(option3);
    			if (detaching) detach_dev(t6);
    			if (detaching) detach_dev(option4);
    			if (detaching) detach_dev(t8);
    			if (detaching) detach_dev(option5);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_18.name,
    		type: "slot",
    		source: "(217:6) <Input type=\\\"select\\\" name=\\\"inputCampo\\\" id=\\\"inputCampo\\\" bind:value=\\\"{campo2}\\\">",
    		ctx
    	});

    	return block;
    }

    // (232:6) <Button color="primary" on:click="{searchRoutes(campo1, valor1,campo2, valor2)}" class="button-search">
    function create_default_slot_17(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Buscar");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_17.name,
    		type: "slot",
    		source: "(232:6) <Button color=\\\"primary\\\" on:click=\\\"{searchRoutes(campo1, valor1,campo2, valor2)}\\\" class=\\\"button-search\\\">",
    		ctx
    	});

    	return block;
    }

    // (191:1) <FormGroup>
    function create_default_slot_16(ctx) {
    	let table;
    	let thead;
    	let tr0;
    	let th0;
    	let label0;
    	let t1;
    	let th1;
    	let label1;
    	let t3;
    	let th2;
    	let label2;
    	let t5;
    	let th3;
    	let label3;
    	let t7;
    	let tbody;
    	let tr1;
    	let td0;
    	let updating_value;
    	let t8;
    	let td1;
    	let updating_value_1;
    	let t9;
    	let td2;
    	let updating_value_2;
    	let t10;
    	let td3;
    	let updating_value_3;
    	let t11;
    	let tr2;
    	let td4;
    	let current;

    	function input0_value_binding(value) {
    		/*input0_value_binding*/ ctx[18].call(null, value);
    	}

    	let input0_props = {
    		type: "select",
    		name: "inputCampo",
    		id: "inputCampo",
    		$$slots: { default: [create_default_slot_19] },
    		$$scope: { ctx }
    	};

    	if (/*campo1*/ ctx[1] !== void 0) {
    		input0_props.value = /*campo1*/ ctx[1];
    	}

    	const input0 = new Input({ props: input0_props, $$inline: true });
    	binding_callbacks.push(() => bind(input0, "value", input0_value_binding));

    	function input1_value_binding(value) {
    		/*input1_value_binding*/ ctx[19].call(null, value);
    	}

    	let input1_props = {
    		type: "text",
    		name: "inputValor",
    		id: "inputValor"
    	};

    	if (/*valor1*/ ctx[2] !== void 0) {
    		input1_props.value = /*valor1*/ ctx[2];
    	}

    	const input1 = new Input({ props: input1_props, $$inline: true });
    	binding_callbacks.push(() => bind(input1, "value", input1_value_binding));

    	function input2_value_binding(value) {
    		/*input2_value_binding*/ ctx[20].call(null, value);
    	}

    	let input2_props = {
    		type: "select",
    		name: "inputCampo",
    		id: "inputCampo",
    		$$slots: { default: [create_default_slot_18] },
    		$$scope: { ctx }
    	};

    	if (/*campo2*/ ctx[3] !== void 0) {
    		input2_props.value = /*campo2*/ ctx[3];
    	}

    	const input2 = new Input({ props: input2_props, $$inline: true });
    	binding_callbacks.push(() => bind(input2, "value", input2_value_binding));

    	function input3_value_binding(value) {
    		/*input3_value_binding*/ ctx[21].call(null, value);
    	}

    	let input3_props = {
    		type: "text",
    		name: "inputValor",
    		id: "inputValor"
    	};

    	if (/*valor2*/ ctx[4] !== void 0) {
    		input3_props.value = /*valor2*/ ctx[4];
    	}

    	const input3 = new Input({ props: input3_props, $$inline: true });
    	binding_callbacks.push(() => bind(input3, "value", input3_value_binding));

    	const button = new Button({
    			props: {
    				color: "primary",
    				class: "button-search",
    				$$slots: { default: [create_default_slot_17] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	button.$on("click", function () {
    		if (is_function(/*searchRoutes*/ ctx[13](/*campo1*/ ctx[1], /*valor1*/ ctx[2], /*campo2*/ ctx[3], /*valor2*/ ctx[4]))) /*searchRoutes*/ ctx[13](/*campo1*/ ctx[1], /*valor1*/ ctx[2], /*campo2*/ ctx[3], /*valor2*/ ctx[4]).apply(this, arguments);
    	});

    	const block = {
    		c: function create() {
    			table = element("table");
    			thead = element("thead");
    			tr0 = element("tr");
    			th0 = element("th");
    			label0 = element("label");
    			label0.textContent = "Buscar por:";
    			t1 = space();
    			th1 = element("th");
    			label1 = element("label");
    			label1.textContent = "Valor:";
    			t3 = space();
    			th2 = element("th");
    			label2 = element("label");
    			label2.textContent = "Buscar por:";
    			t5 = space();
    			th3 = element("th");
    			label3 = element("label");
    			label3.textContent = "Valor:";
    			t7 = space();
    			tbody = element("tbody");
    			tr1 = element("tr");
    			td0 = element("td");
    			create_component(input0.$$.fragment);
    			t8 = space();
    			td1 = element("td");
    			create_component(input1.$$.fragment);
    			t9 = space();
    			td2 = element("td");
    			create_component(input2.$$.fragment);
    			t10 = space();
    			td3 = element("td");
    			create_component(input3.$$.fragment);
    			t11 = space();
    			tr2 = element("tr");
    			td4 = element("td");
    			create_component(button.$$.fragment);
    			add_location(label0, file$a, 194, 9, 5663);
    			add_location(th0, file$a, 194, 5, 5659);
    			add_location(label1, file$a, 195, 9, 5705);
    			add_location(th1, file$a, 195, 5, 5701);
    			add_location(label2, file$a, 196, 9, 5742);
    			add_location(th2, file$a, 196, 5, 5738);
    			add_location(label3, file$a, 197, 9, 5784);
    			add_location(th3, file$a, 197, 5, 5780);
    			add_location(tr0, file$a, 193, 4, 5648);
    			add_location(thead, file$a, 192, 3, 5635);
    			add_location(td0, file$a, 202, 5, 5863);
    			add_location(td1, file$a, 212, 5, 6275);
    			add_location(td2, file$a, 215, 5, 6390);
    			add_location(td3, file$a, 225, 5, 6802);
    			add_location(tr1, file$a, 201, 4, 5852);
    			set_style(td4, "width", "25%");
    			add_location(td4, file$a, 230, 5, 6938);
    			add_location(tr2, file$a, 229, 4, 6927);
    			add_location(tbody, file$a, 200, 3, 5839);
    			set_style(table, "width", "100%");
    			add_location(table, file$a, 191, 2, 5602);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, table, anchor);
    			append_dev(table, thead);
    			append_dev(thead, tr0);
    			append_dev(tr0, th0);
    			append_dev(th0, label0);
    			append_dev(tr0, t1);
    			append_dev(tr0, th1);
    			append_dev(th1, label1);
    			append_dev(tr0, t3);
    			append_dev(tr0, th2);
    			append_dev(th2, label2);
    			append_dev(tr0, t5);
    			append_dev(tr0, th3);
    			append_dev(th3, label3);
    			append_dev(table, t7);
    			append_dev(table, tbody);
    			append_dev(tbody, tr1);
    			append_dev(tr1, td0);
    			mount_component(input0, td0, null);
    			append_dev(tr1, t8);
    			append_dev(tr1, td1);
    			mount_component(input1, td1, null);
    			append_dev(tr1, t9);
    			append_dev(tr1, td2);
    			mount_component(input2, td2, null);
    			append_dev(tr1, t10);
    			append_dev(tr1, td3);
    			mount_component(input3, td3, null);
    			append_dev(tbody, t11);
    			append_dev(tbody, tr2);
    			append_dev(tr2, td4);
    			mount_component(button, td4, null);
    			current = true;
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			const input0_changes = {};

    			if (dirty[1] & /*$$scope*/ 8) {
    				input0_changes.$$scope = { dirty, ctx };
    			}

    			if (!updating_value && dirty[0] & /*campo1*/ 2) {
    				updating_value = true;
    				input0_changes.value = /*campo1*/ ctx[1];
    				add_flush_callback(() => updating_value = false);
    			}

    			input0.$set(input0_changes);
    			const input1_changes = {};

    			if (!updating_value_1 && dirty[0] & /*valor1*/ 4) {
    				updating_value_1 = true;
    				input1_changes.value = /*valor1*/ ctx[2];
    				add_flush_callback(() => updating_value_1 = false);
    			}

    			input1.$set(input1_changes);
    			const input2_changes = {};

    			if (dirty[1] & /*$$scope*/ 8) {
    				input2_changes.$$scope = { dirty, ctx };
    			}

    			if (!updating_value_2 && dirty[0] & /*campo2*/ 8) {
    				updating_value_2 = true;
    				input2_changes.value = /*campo2*/ ctx[3];
    				add_flush_callback(() => updating_value_2 = false);
    			}

    			input2.$set(input2_changes);
    			const input3_changes = {};

    			if (!updating_value_3 && dirty[0] & /*valor2*/ 16) {
    				updating_value_3 = true;
    				input3_changes.value = /*valor2*/ ctx[4];
    				add_flush_callback(() => updating_value_3 = false);
    			}

    			input3.$set(input3_changes);
    			const button_changes = {};

    			if (dirty[1] & /*$$scope*/ 8) {
    				button_changes.$$scope = { dirty, ctx };
    			}

    			button.$set(button_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(input0.$$.fragment, local);
    			transition_in(input1.$$.fragment, local);
    			transition_in(input2.$$.fragment, local);
    			transition_in(input3.$$.fragment, local);
    			transition_in(button.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(input0.$$.fragment, local);
    			transition_out(input1.$$.fragment, local);
    			transition_out(input2.$$.fragment, local);
    			transition_out(input3.$$.fragment, local);
    			transition_out(button.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(table);
    			destroy_component(input0);
    			destroy_component(input1);
    			destroy_component(input2);
    			destroy_component(input3);
    			destroy_component(button);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_16.name,
    		type: "slot",
    		source: "(191:1) <FormGroup>",
    		ctx
    	});

    	return block;
    }

    // (262:11) <Button outline color="danger" on:click="{deleteRoute(route.province, route.year)}">
    function create_default_slot_15(ctx) {
    	let i;

    	const block = {
    		c: function create() {
    			i = element("i");
    			attr_dev(i, "class", "fa fa-trash");
    			attr_dev(i, "aria-hidden", "true");
    			add_location(i, file$a, 262, 7, 7780);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, i, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(i);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_15.name,
    		type: "slot",
    		source: "(262:11) <Button outline color=\\\"danger\\\" on:click=\\\"{deleteRoute(route.province, route.year)}\\\">",
    		ctx
    	});

    	return block;
    }

    // (255:4) {#each routes as route}
    function create_each_block(ctx) {
    	let tr;
    	let a;
    	let t0_value = /*route*/ ctx[31].province + "";
    	let t0;
    	let a_href_value;
    	let t1;
    	let td0;
    	let t2_value = /*route*/ ctx[31].year + "";
    	let t2;
    	let t3;
    	let td1;
    	let t4_value = /*route*/ ctx[31].metropolitan + "";
    	let t4;
    	let t5;
    	let td2;
    	let t6_value = /*route*/ ctx[31].urban + "";
    	let t6;
    	let t7;
    	let td3;
    	let t8_value = /*route*/ ctx[31].rest + "";
    	let t8;
    	let t9;
    	let td4;
    	let t10;
    	let current;

    	const button = new Button({
    			props: {
    				outline: true,
    				color: "danger",
    				$$slots: { default: [create_default_slot_15] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	button.$on("click", function () {
    		if (is_function(/*deleteRoute*/ ctx[11](/*route*/ ctx[31].province, /*route*/ ctx[31].year))) /*deleteRoute*/ ctx[11](/*route*/ ctx[31].province, /*route*/ ctx[31].year).apply(this, arguments);
    	});

    	const block = {
    		c: function create() {
    			tr = element("tr");
    			a = element("a");
    			t0 = text(t0_value);
    			t1 = space();
    			td0 = element("td");
    			t2 = text(t2_value);
    			t3 = space();
    			td1 = element("td");
    			t4 = text(t4_value);
    			t5 = space();
    			td2 = element("td");
    			t6 = text(t6_value);
    			t7 = space();
    			td3 = element("td");
    			t8 = text(t8_value);
    			t9 = space();
    			td4 = element("td");
    			create_component(button.$$.fragment);
    			t10 = space();
    			set_style(a, "text-align", "center");
    			attr_dev(a, "href", a_href_value = "#/evolution-of-cycling-routes/" + /*route*/ ctx[31].province + "/" + /*route*/ ctx[31].year);
    			add_location(a, file$a, 256, 6, 7431);
    			add_location(td0, file$a, 257, 6, 7557);
    			add_location(td1, file$a, 258, 6, 7586);
    			add_location(td2, file$a, 259, 6, 7623);
    			add_location(td3, file$a, 260, 6, 7653);
    			add_location(td4, file$a, 261, 6, 7682);
    			add_location(tr, file$a, 255, 5, 7419);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, tr, anchor);
    			append_dev(tr, a);
    			append_dev(a, t0);
    			append_dev(tr, t1);
    			append_dev(tr, td0);
    			append_dev(td0, t2);
    			append_dev(tr, t3);
    			append_dev(tr, td1);
    			append_dev(td1, t4);
    			append_dev(tr, t5);
    			append_dev(tr, td2);
    			append_dev(td2, t6);
    			append_dev(tr, t7);
    			append_dev(tr, td3);
    			append_dev(td3, t8);
    			append_dev(tr, t9);
    			append_dev(tr, td4);
    			mount_component(button, td4, null);
    			append_dev(tr, t10);
    			current = true;
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			if ((!current || dirty[0] & /*routes*/ 256) && t0_value !== (t0_value = /*route*/ ctx[31].province + "")) set_data_dev(t0, t0_value);

    			if (!current || dirty[0] & /*routes*/ 256 && a_href_value !== (a_href_value = "#/evolution-of-cycling-routes/" + /*route*/ ctx[31].province + "/" + /*route*/ ctx[31].year)) {
    				attr_dev(a, "href", a_href_value);
    			}

    			if ((!current || dirty[0] & /*routes*/ 256) && t2_value !== (t2_value = /*route*/ ctx[31].year + "")) set_data_dev(t2, t2_value);
    			if ((!current || dirty[0] & /*routes*/ 256) && t4_value !== (t4_value = /*route*/ ctx[31].metropolitan + "")) set_data_dev(t4, t4_value);
    			if ((!current || dirty[0] & /*routes*/ 256) && t6_value !== (t6_value = /*route*/ ctx[31].urban + "")) set_data_dev(t6, t6_value);
    			if ((!current || dirty[0] & /*routes*/ 256) && t8_value !== (t8_value = /*route*/ ctx[31].rest + "")) set_data_dev(t8, t8_value);
    			const button_changes = {};

    			if (dirty[1] & /*$$scope*/ 8) {
    				button_changes.$$scope = { dirty, ctx };
    			}

    			button.$set(button_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(button.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(button.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(tr);
    			destroy_component(button);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block.name,
    		type: "each",
    		source: "(255:4) {#each routes as route}",
    		ctx
    	});

    	return block;
    }

    // (241:2) <Table bordered >
    function create_default_slot_14(ctx) {
    	let thead;
    	let tr;
    	let th0;
    	let t1;
    	let th1;
    	let t3;
    	let th2;
    	let t5;
    	let th3;
    	let t7;
    	let th4;
    	let t9;
    	let th5;
    	let t11;
    	let tbody;
    	let current;
    	let each_value = /*routes*/ ctx[8];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	const block = {
    		c: function create() {
    			thead = element("thead");
    			tr = element("tr");
    			th0 = element("th");
    			th0.textContent = "Provincia";
    			t1 = space();
    			th1 = element("th");
    			th1.textContent = "Año";
    			t3 = space();
    			th2 = element("th");
    			th2.textContent = "Metropolitano";
    			t5 = space();
    			th3 = element("th");
    			th3.textContent = "Urbano";
    			t7 = space();
    			th4 = element("th");
    			th4.textContent = "Resto";
    			t9 = space();
    			th5 = element("th");
    			th5.textContent = "Acciones";
    			t11 = space();
    			tbody = element("tbody");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			add_location(th0, file$a, 243, 5, 7209);
    			add_location(th1, file$a, 244, 5, 7235);
    			add_location(th2, file$a, 245, 5, 7254);
    			add_location(th3, file$a, 246, 5, 7283);
    			add_location(th4, file$a, 247, 5, 7305);
    			add_location(th5, file$a, 248, 5, 7326);
    			add_location(tr, file$a, 242, 4, 7198);
    			add_location(thead, file$a, 241, 3, 7185);
    			add_location(tbody, file$a, 251, 3, 7372);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, thead, anchor);
    			append_dev(thead, tr);
    			append_dev(tr, th0);
    			append_dev(tr, t1);
    			append_dev(tr, th1);
    			append_dev(tr, t3);
    			append_dev(tr, th2);
    			append_dev(tr, t5);
    			append_dev(tr, th3);
    			append_dev(tr, t7);
    			append_dev(tr, th4);
    			append_dev(tr, t9);
    			append_dev(tr, th5);
    			insert_dev(target, t11, anchor);
    			insert_dev(target, tbody, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(tbody, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*deleteRoute, routes*/ 2304) {
    				each_value = /*routes*/ ctx[8];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(tbody, null);
    					}
    				}

    				group_outros();

    				for (i = each_value.length; i < each_blocks.length; i += 1) {
    					out(i);
    				}

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			each_blocks = each_blocks.filter(Boolean);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(thead);
    			if (detaching) detach_dev(t11);
    			if (detaching) detach_dev(tbody);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_14.name,
    		type: "slot",
    		source: "(241:2) <Table bordered >",
    		ctx
    	});

    	return block;
    }

    // (277:9) <Button style="margin-bottom:3%;" color="primary" on:click={insertRoute}>
    function create_default_slot_13(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Añadir");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_13.name,
    		type: "slot",
    		source: "(277:9) <Button style=\\\"margin-bottom:3%;\\\" color=\\\"primary\\\" on:click={insertRoute}>",
    		ctx
    	});

    	return block;
    }

    // (270:2) <Table style="background-color:#EAEEF0;">
    function create_default_slot_12(ctx) {
    	let tr;
    	let td0;
    	let updating_value;
    	let t0;
    	let td1;
    	let updating_value_1;
    	let t1;
    	let td2;
    	let updating_value_2;
    	let t2;
    	let td3;
    	let updating_value_3;
    	let t3;
    	let td4;
    	let updating_value_4;
    	let t4;
    	let td5;
    	let current;

    	function input0_value_binding_1(value) {
    		/*input0_value_binding_1*/ ctx[22].call(null, value);
    	}

    	let input0_props = { type: "text" };

    	if (/*newRoute*/ ctx[0].province !== void 0) {
    		input0_props.value = /*newRoute*/ ctx[0].province;
    	}

    	const input0 = new Input({ props: input0_props, $$inline: true });
    	binding_callbacks.push(() => bind(input0, "value", input0_value_binding_1));

    	function input1_value_binding_1(value) {
    		/*input1_value_binding_1*/ ctx[23].call(null, value);
    	}

    	let input1_props = { type: "number" };

    	if (/*newRoute*/ ctx[0].year !== void 0) {
    		input1_props.value = /*newRoute*/ ctx[0].year;
    	}

    	const input1 = new Input({ props: input1_props, $$inline: true });
    	binding_callbacks.push(() => bind(input1, "value", input1_value_binding_1));

    	function input2_value_binding_1(value) {
    		/*input2_value_binding_1*/ ctx[24].call(null, value);
    	}

    	let input2_props = { type: "number" };

    	if (/*newRoute*/ ctx[0].metropolitan !== void 0) {
    		input2_props.value = /*newRoute*/ ctx[0].metropolitan;
    	}

    	const input2 = new Input({ props: input2_props, $$inline: true });
    	binding_callbacks.push(() => bind(input2, "value", input2_value_binding_1));

    	function input3_value_binding_1(value) {
    		/*input3_value_binding_1*/ ctx[25].call(null, value);
    	}

    	let input3_props = { type: "number" };

    	if (/*newRoute*/ ctx[0].urban !== void 0) {
    		input3_props.value = /*newRoute*/ ctx[0].urban;
    	}

    	const input3 = new Input({ props: input3_props, $$inline: true });
    	binding_callbacks.push(() => bind(input3, "value", input3_value_binding_1));

    	function input4_value_binding(value) {
    		/*input4_value_binding*/ ctx[26].call(null, value);
    	}

    	let input4_props = { type: "number" };

    	if (/*newRoute*/ ctx[0].rest !== void 0) {
    		input4_props.value = /*newRoute*/ ctx[0].rest;
    	}

    	const input4 = new Input({ props: input4_props, $$inline: true });
    	binding_callbacks.push(() => bind(input4, "value", input4_value_binding));

    	const button = new Button({
    			props: {
    				style: "margin-bottom:3%;",
    				color: "primary",
    				$$slots: { default: [create_default_slot_13] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	button.$on("click", /*insertRoute*/ ctx[9]);

    	const block = {
    		c: function create() {
    			tr = element("tr");
    			td0 = element("td");
    			create_component(input0.$$.fragment);
    			t0 = space();
    			td1 = element("td");
    			create_component(input1.$$.fragment);
    			t1 = space();
    			td2 = element("td");
    			create_component(input2.$$.fragment);
    			t2 = space();
    			td3 = element("td");
    			create_component(input3.$$.fragment);
    			t3 = space();
    			td4 = element("td");
    			create_component(input4.$$.fragment);
    			t4 = space();
    			td5 = element("td");
    			create_component(button.$$.fragment);
    			add_location(td0, file$a, 271, 4, 8021);
    			add_location(td1, file$a, 272, 4, 8089);
    			add_location(td2, file$a, 273, 4, 8155);
    			add_location(td3, file$a, 274, 4, 8229);
    			add_location(td4, file$a, 275, 4, 8296);
    			add_location(td5, file$a, 276, 4, 8362);
    			add_location(tr, file$a, 270, 3, 8011);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, tr, anchor);
    			append_dev(tr, td0);
    			mount_component(input0, td0, null);
    			append_dev(tr, t0);
    			append_dev(tr, td1);
    			mount_component(input1, td1, null);
    			append_dev(tr, t1);
    			append_dev(tr, td2);
    			mount_component(input2, td2, null);
    			append_dev(tr, t2);
    			append_dev(tr, td3);
    			mount_component(input3, td3, null);
    			append_dev(tr, t3);
    			append_dev(tr, td4);
    			mount_component(input4, td4, null);
    			append_dev(tr, t4);
    			append_dev(tr, td5);
    			mount_component(button, td5, null);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const input0_changes = {};

    			if (!updating_value && dirty[0] & /*newRoute*/ 1) {
    				updating_value = true;
    				input0_changes.value = /*newRoute*/ ctx[0].province;
    				add_flush_callback(() => updating_value = false);
    			}

    			input0.$set(input0_changes);
    			const input1_changes = {};

    			if (!updating_value_1 && dirty[0] & /*newRoute*/ 1) {
    				updating_value_1 = true;
    				input1_changes.value = /*newRoute*/ ctx[0].year;
    				add_flush_callback(() => updating_value_1 = false);
    			}

    			input1.$set(input1_changes);
    			const input2_changes = {};

    			if (!updating_value_2 && dirty[0] & /*newRoute*/ 1) {
    				updating_value_2 = true;
    				input2_changes.value = /*newRoute*/ ctx[0].metropolitan;
    				add_flush_callback(() => updating_value_2 = false);
    			}

    			input2.$set(input2_changes);
    			const input3_changes = {};

    			if (!updating_value_3 && dirty[0] & /*newRoute*/ 1) {
    				updating_value_3 = true;
    				input3_changes.value = /*newRoute*/ ctx[0].urban;
    				add_flush_callback(() => updating_value_3 = false);
    			}

    			input3.$set(input3_changes);
    			const input4_changes = {};

    			if (!updating_value_4 && dirty[0] & /*newRoute*/ 1) {
    				updating_value_4 = true;
    				input4_changes.value = /*newRoute*/ ctx[0].rest;
    				add_flush_callback(() => updating_value_4 = false);
    			}

    			input4.$set(input4_changes);
    			const button_changes = {};

    			if (dirty[1] & /*$$scope*/ 8) {
    				button_changes.$$scope = { dirty, ctx };
    			}

    			button.$set(button_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(input0.$$.fragment, local);
    			transition_in(input1.$$.fragment, local);
    			transition_in(input2.$$.fragment, local);
    			transition_in(input3.$$.fragment, local);
    			transition_in(input4.$$.fragment, local);
    			transition_in(button.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(input0.$$.fragment, local);
    			transition_out(input1.$$.fragment, local);
    			transition_out(input2.$$.fragment, local);
    			transition_out(input3.$$.fragment, local);
    			transition_out(input4.$$.fragment, local);
    			transition_out(button.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(tr);
    			destroy_component(input0);
    			destroy_component(input1);
    			destroy_component(input2);
    			destroy_component(input3);
    			destroy_component(input4);
    			destroy_component(button);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_12.name,
    		type: "slot",
    		source: "(270:2) <Table style=\\\"background-color:#EAEEF0;\\\">",
    		ctx
    	});

    	return block;
    }

    // (187:16)     Loading cycling routes...   {:then routes}
    function create_pending_block(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Loading cycling routes...");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_pending_block.name,
    		type: "pending",
    		source: "(187:16)     Loading cycling routes...   {:then routes}",
    		ctx
    	});

    	return block;
    }

    // (283:1) {#if msgOk}
    function create_if_block_2$2(ctx) {
    	let p;
    	let t0;
    	let t1;

    	const block = {
    		c: function create() {
    			p = element("p");
    			t0 = text("EXITO: ");
    			t1 = text(/*msgOk*/ ctx[7]);
    			set_style(p, "color", "green");
    			add_location(p, file$a, 283, 8, 8590);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, p, anchor);
    			append_dev(p, t0);
    			append_dev(p, t1);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*msgOk*/ 128) set_data_dev(t1, /*msgOk*/ ctx[7]);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(p);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2$2.name,
    		type: "if",
    		source: "(283:1) {#if msgOk}",
    		ctx
    	});

    	return block;
    }

    // (290:0) <PaginationItem class="{pageActual === 1 ? 'disabled' : ''}">
    function create_default_slot_11(ctx) {
    	let current;

    	const paginationlink = new PaginationLink({
    			props: {
    				previous: true,
    				href: "#/evolution-of-cycling-routes"
    			},
    			$$inline: true
    		});

    	paginationlink.$on("click", /*click_handler*/ ctx[27]);

    	const block = {
    		c: function create() {
    			create_component(paginationlink.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(paginationlink, target, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(paginationlink.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(paginationlink.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(paginationlink, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_11.name,
    		type: "slot",
    		source: "(290:0) <PaginationItem class=\\\"{pageActual === 1 ? 'disabled' : ''}\\\">",
    		ctx
    	});

    	return block;
    }

    // (294:2) {#if pageActual != 1}
    function create_if_block_1$2(ctx) {
    	let current;

    	const paginationitem = new PaginationItem({
    			props: {
    				$$slots: { default: [create_default_slot_9] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(paginationitem.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(paginationitem, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const paginationitem_changes = {};

    			if (dirty[0] & /*pageActual*/ 32 | dirty[1] & /*$$scope*/ 8) {
    				paginationitem_changes.$$scope = { dirty, ctx };
    			}

    			paginationitem.$set(paginationitem_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(paginationitem.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(paginationitem.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(paginationitem, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$2.name,
    		type: "if",
    		source: "(294:2) {#if pageActual != 1}",
    		ctx
    	});

    	return block;
    }

    // (296:3) <PaginationLink href="#/evolution-of-cycling-routes" on:click="{() => addOffset(-1)}" >
    function create_default_slot_10(ctx) {
    	let t_value = /*pageActual*/ ctx[5] - 1 + "";
    	let t;

    	const block = {
    		c: function create() {
    			t = text(t_value);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*pageActual*/ 32 && t_value !== (t_value = /*pageActual*/ ctx[5] - 1 + "")) set_data_dev(t, t_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_10.name,
    		type: "slot",
    		source: "(296:3) <PaginationLink href=\\\"#/evolution-of-cycling-routes\\\" on:click=\\\"{() => addOffset(-1)}\\\" >",
    		ctx
    	});

    	return block;
    }

    // (295:2) <PaginationItem>
    function create_default_slot_9(ctx) {
    	let current;

    	const paginationlink = new PaginationLink({
    			props: {
    				href: "#/evolution-of-cycling-routes",
    				$$slots: { default: [create_default_slot_10] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	paginationlink.$on("click", /*click_handler_1*/ ctx[28]);

    	const block = {
    		c: function create() {
    			create_component(paginationlink.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(paginationlink, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const paginationlink_changes = {};

    			if (dirty[0] & /*pageActual*/ 32 | dirty[1] & /*$$scope*/ 8) {
    				paginationlink_changes.$$scope = { dirty, ctx };
    			}

    			paginationlink.$set(paginationlink_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(paginationlink.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(paginationlink.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(paginationlink, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_9.name,
    		type: "slot",
    		source: "(295:2) <PaginationItem>",
    		ctx
    	});

    	return block;
    }

    // (300:3) <PaginationLink href="#/evolution-of-cycling-routes" >
    function create_default_slot_8(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text(/*pageActual*/ ctx[5]);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*pageActual*/ 32) set_data_dev(t, /*pageActual*/ ctx[5]);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_8.name,
    		type: "slot",
    		source: "(300:3) <PaginationLink href=\\\"#/evolution-of-cycling-routes\\\" >",
    		ctx
    	});

    	return block;
    }

    // (299:2) <PaginationItem active>
    function create_default_slot_7(ctx) {
    	let current;

    	const paginationlink = new PaginationLink({
    			props: {
    				href: "#/evolution-of-cycling-routes",
    				$$slots: { default: [create_default_slot_8] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(paginationlink.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(paginationlink, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const paginationlink_changes = {};

    			if (dirty[0] & /*pageActual*/ 32 | dirty[1] & /*$$scope*/ 8) {
    				paginationlink_changes.$$scope = { dirty, ctx };
    			}

    			paginationlink.$set(paginationlink_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(paginationlink.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(paginationlink.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(paginationlink, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_7.name,
    		type: "slot",
    		source: "(299:2) <PaginationItem active>",
    		ctx
    	});

    	return block;
    }

    // (303:2) {#if moreData}
    function create_if_block$6(ctx) {
    	let current;

    	const paginationitem = new PaginationItem({
    			props: {
    				$$slots: { default: [create_default_slot_5] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(paginationitem.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(paginationitem, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const paginationitem_changes = {};

    			if (dirty[0] & /*pageActual*/ 32 | dirty[1] & /*$$scope*/ 8) {
    				paginationitem_changes.$$scope = { dirty, ctx };
    			}

    			paginationitem.$set(paginationitem_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(paginationitem.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(paginationitem.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(paginationitem, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$6.name,
    		type: "if",
    		source: "(303:2) {#if moreData}",
    		ctx
    	});

    	return block;
    }

    // (305:3) <PaginationLink href="#/evolution-of-cycling-routes" on:click="{() => addOffset(1)}">
    function create_default_slot_6(ctx) {
    	let t_value = /*pageActual*/ ctx[5] + 1 + "";
    	let t;

    	const block = {
    		c: function create() {
    			t = text(t_value);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*pageActual*/ 32 && t_value !== (t_value = /*pageActual*/ ctx[5] + 1 + "")) set_data_dev(t, t_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_6.name,
    		type: "slot",
    		source: "(305:3) <PaginationLink href=\\\"#/evolution-of-cycling-routes\\\" on:click=\\\"{() => addOffset(1)}\\\">",
    		ctx
    	});

    	return block;
    }

    // (304:2) <PaginationItem >
    function create_default_slot_5(ctx) {
    	let current;

    	const paginationlink = new PaginationLink({
    			props: {
    				href: "#/evolution-of-cycling-routes",
    				$$slots: { default: [create_default_slot_6] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	paginationlink.$on("click", /*click_handler_2*/ ctx[29]);

    	const block = {
    		c: function create() {
    			create_component(paginationlink.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(paginationlink, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const paginationlink_changes = {};

    			if (dirty[0] & /*pageActual*/ 32 | dirty[1] & /*$$scope*/ 8) {
    				paginationlink_changes.$$scope = { dirty, ctx };
    			}

    			paginationlink.$set(paginationlink_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(paginationlink.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(paginationlink.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(paginationlink, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_5.name,
    		type: "slot",
    		source: "(304:2) <PaginationItem >",
    		ctx
    	});

    	return block;
    }

    // (308:2) <PaginationItem class="{moreData ? '' : 'disabled'}">
    function create_default_slot_4(ctx) {
    	let current;

    	const paginationlink = new PaginationLink({
    			props: {
    				next: true,
    				href: "#/evolution-of-cycling-routes"
    			},
    			$$inline: true
    		});

    	paginationlink.$on("click", /*click_handler_3*/ ctx[30]);

    	const block = {
    		c: function create() {
    			create_component(paginationlink.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(paginationlink, target, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(paginationlink.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(paginationlink.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(paginationlink, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_4.name,
    		type: "slot",
    		source: "(308:2) <PaginationItem class=\\\"{moreData ? '' : 'disabled'}\\\">",
    		ctx
    	});

    	return block;
    }

    // (288:0) <Pagination style="float:right;" ariaLabel="Cambiar de página">
    function create_default_slot_3(ctx) {
    	let t0;
    	let t1;
    	let t2;
    	let t3;
    	let current;

    	const paginationitem0 = new PaginationItem({
    			props: {
    				class: /*pageActual*/ ctx[5] === 1 ? "disabled" : "",
    				$$slots: { default: [create_default_slot_11] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	let if_block0 = /*pageActual*/ ctx[5] != 1 && create_if_block_1$2(ctx);

    	const paginationitem1 = new PaginationItem({
    			props: {
    				active: true,
    				$$slots: { default: [create_default_slot_7] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	let if_block1 = /*moreData*/ ctx[6] && create_if_block$6(ctx);

    	const paginationitem2 = new PaginationItem({
    			props: {
    				class: /*moreData*/ ctx[6] ? "" : "disabled",
    				$$slots: { default: [create_default_slot_4] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(paginationitem0.$$.fragment);
    			t0 = space();
    			if (if_block0) if_block0.c();
    			t1 = space();
    			create_component(paginationitem1.$$.fragment);
    			t2 = space();
    			if (if_block1) if_block1.c();
    			t3 = space();
    			create_component(paginationitem2.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(paginationitem0, target, anchor);
    			insert_dev(target, t0, anchor);
    			if (if_block0) if_block0.m(target, anchor);
    			insert_dev(target, t1, anchor);
    			mount_component(paginationitem1, target, anchor);
    			insert_dev(target, t2, anchor);
    			if (if_block1) if_block1.m(target, anchor);
    			insert_dev(target, t3, anchor);
    			mount_component(paginationitem2, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const paginationitem0_changes = {};
    			if (dirty[0] & /*pageActual*/ 32) paginationitem0_changes.class = /*pageActual*/ ctx[5] === 1 ? "disabled" : "";

    			if (dirty[1] & /*$$scope*/ 8) {
    				paginationitem0_changes.$$scope = { dirty, ctx };
    			}

    			paginationitem0.$set(paginationitem0_changes);

    			if (/*pageActual*/ ctx[5] != 1) {
    				if (if_block0) {
    					if_block0.p(ctx, dirty);

    					if (dirty[0] & /*pageActual*/ 32) {
    						transition_in(if_block0, 1);
    					}
    				} else {
    					if_block0 = create_if_block_1$2(ctx);
    					if_block0.c();
    					transition_in(if_block0, 1);
    					if_block0.m(t1.parentNode, t1);
    				}
    			} else if (if_block0) {
    				group_outros();

    				transition_out(if_block0, 1, 1, () => {
    					if_block0 = null;
    				});

    				check_outros();
    			}

    			const paginationitem1_changes = {};

    			if (dirty[0] & /*pageActual*/ 32 | dirty[1] & /*$$scope*/ 8) {
    				paginationitem1_changes.$$scope = { dirty, ctx };
    			}

    			paginationitem1.$set(paginationitem1_changes);

    			if (/*moreData*/ ctx[6]) {
    				if (if_block1) {
    					if_block1.p(ctx, dirty);

    					if (dirty[0] & /*moreData*/ 64) {
    						transition_in(if_block1, 1);
    					}
    				} else {
    					if_block1 = create_if_block$6(ctx);
    					if_block1.c();
    					transition_in(if_block1, 1);
    					if_block1.m(t3.parentNode, t3);
    				}
    			} else if (if_block1) {
    				group_outros();

    				transition_out(if_block1, 1, 1, () => {
    					if_block1 = null;
    				});

    				check_outros();
    			}

    			const paginationitem2_changes = {};
    			if (dirty[0] & /*moreData*/ 64) paginationitem2_changes.class = /*moreData*/ ctx[6] ? "" : "disabled";

    			if (dirty[1] & /*$$scope*/ 8) {
    				paginationitem2_changes.$$scope = { dirty, ctx };
    			}

    			paginationitem2.$set(paginationitem2_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(paginationitem0.$$.fragment, local);
    			transition_in(if_block0);
    			transition_in(paginationitem1.$$.fragment, local);
    			transition_in(if_block1);
    			transition_in(paginationitem2.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(paginationitem0.$$.fragment, local);
    			transition_out(if_block0);
    			transition_out(paginationitem1.$$.fragment, local);
    			transition_out(if_block1);
    			transition_out(paginationitem2.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(paginationitem0, detaching);
    			if (detaching) detach_dev(t0);
    			if (if_block0) if_block0.d(detaching);
    			if (detaching) detach_dev(t1);
    			destroy_component(paginationitem1, detaching);
    			if (detaching) detach_dev(t2);
    			if (if_block1) if_block1.d(detaching);
    			if (detaching) detach_dev(t3);
    			destroy_component(paginationitem2, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_3.name,
    		type: "slot",
    		source: "(288:0) <Pagination style=\\\"float:right;\\\" ariaLabel=\\\"Cambiar de página\\\">",
    		ctx
    	});

    	return block;
    }

    // (313:0) <Button outline color="secondary" on:click="{pop}">
    function create_default_slot_2(ctx) {
    	let i;

    	const block = {
    		c: function create() {
    			i = element("i");
    			attr_dev(i, "class", "fas fa-arrow-circle-left");
    			add_location(i, file$a, 312, 52, 9711);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, i, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(i);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_2.name,
    		type: "slot",
    		source: "(313:0) <Button outline color=\\\"secondary\\\" on:click=\\\"{pop}\\\">",
    		ctx
    	});

    	return block;
    }

    // (314:0) <Button outline on:click={deleteRoutes} color="danger">
    function create_default_slot_1(ctx) {
    	let i;
    	let t;

    	const block = {
    		c: function create() {
    			i = element("i");
    			t = text(" Todo");
    			attr_dev(i, "class", "fa fa-trash");
    			attr_dev(i, "aria-hidden", "true");
    			add_location(i, file$a, 313, 56, 9841);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, i, anchor);
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(i);
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1.name,
    		type: "slot",
    		source: "(314:0) <Button outline on:click={deleteRoutes} color=\\\"danger\\\">",
    		ctx
    	});

    	return block;
    }

    // (315:0) <Button outline on:click={loadInitialData} color="primary">
    function create_default_slot(ctx) {
    	let i;
    	let t;

    	const block = {
    		c: function create() {
    			i = element("i");
    			t = text(" Datos Iniciales");
    			attr_dev(i, "class", "fas fa-spinner");
    			add_location(i, file$a, 314, 60, 9993);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, i, anchor);
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(i);
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot.name,
    		type: "slot",
    		source: "(315:0) <Button outline on:click={loadInitialData} color=\\\"primary\\\">",
    		ctx
    	});

    	return block;
    }

    function create_fragment$d(ctx) {
    	let main;
    	let h2;
    	let i;
    	let t0;
    	let t1;
    	let promise;
    	let t2;
    	let t3;
    	let t4;
    	let t5;
    	let t6;
    	let current;

    	let info = {
    		ctx,
    		current: null,
    		token: null,
    		pending: create_pending_block,
    		then: create_then_block,
    		catch: create_catch_block,
    		value: 8,
    		blocks: [,,,]
    	};

    	handle_promise(promise = /*routes*/ ctx[8], info);
    	let if_block = /*msgOk*/ ctx[7] && create_if_block_2$2(ctx);

    	const pagination = new Pagination({
    			props: {
    				style: "float:right;",
    				ariaLabel: "Cambiar de página",
    				$$slots: { default: [create_default_slot_3] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const button0 = new Button({
    			props: {
    				outline: true,
    				color: "secondary",
    				$$slots: { default: [create_default_slot_2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	button0.$on("click", pop);

    	const button1 = new Button({
    			props: {
    				outline: true,
    				color: "danger",
    				$$slots: { default: [create_default_slot_1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	button1.$on("click", /*deleteRoutes*/ ctx[10]);

    	const button2 = new Button({
    			props: {
    				outline: true,
    				color: "primary",
    				$$slots: { default: [create_default_slot] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	button2.$on("click", /*loadInitialData*/ ctx[12]);

    	const block = {
    		c: function create() {
    			main = element("main");
    			h2 = element("h2");
    			i = element("i");
    			t0 = text(" Evolucion Carriles Bici");
    			t1 = space();
    			info.block.c();
    			t2 = space();
    			if (if_block) if_block.c();
    			t3 = space();
    			create_component(pagination.$$.fragment);
    			t4 = space();
    			create_component(button0.$$.fragment);
    			t5 = space();
    			create_component(button1.$$.fragment);
    			t6 = space();
    			create_component(button2.$$.fragment);
    			attr_dev(i, "class", "fas fa-bicycle");
    			add_location(i, file$a, 185, 34, 5457);
    			set_style(h2, "text-align", "center");
    			add_location(h2, file$a, 185, 1, 5424);
    			add_location(main, file$a, 184, 0, 5415);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			append_dev(main, h2);
    			append_dev(h2, i);
    			append_dev(h2, t0);
    			append_dev(main, t1);
    			info.block.m(main, info.anchor = null);
    			info.mount = () => main;
    			info.anchor = t2;
    			append_dev(main, t2);
    			if (if_block) if_block.m(main, null);
    			append_dev(main, t3);
    			mount_component(pagination, main, null);
    			append_dev(main, t4);
    			mount_component(button0, main, null);
    			append_dev(main, t5);
    			mount_component(button1, main, null);
    			append_dev(main, t6);
    			mount_component(button2, main, null);
    			current = true;
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			info.ctx = ctx;

    			if (dirty[0] & /*routes*/ 256 && promise !== (promise = /*routes*/ ctx[8]) && handle_promise(promise, info)) ; else {
    				const child_ctx = ctx.slice();
    				child_ctx[8] = info.resolved;
    				info.block.p(child_ctx, dirty);
    			}

    			if (/*msgOk*/ ctx[7]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block_2$2(ctx);
    					if_block.c();
    					if_block.m(main, t3);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}

    			const pagination_changes = {};

    			if (dirty[0] & /*moreData, pageActual*/ 96 | dirty[1] & /*$$scope*/ 8) {
    				pagination_changes.$$scope = { dirty, ctx };
    			}

    			pagination.$set(pagination_changes);
    			const button0_changes = {};

    			if (dirty[1] & /*$$scope*/ 8) {
    				button0_changes.$$scope = { dirty, ctx };
    			}

    			button0.$set(button0_changes);
    			const button1_changes = {};

    			if (dirty[1] & /*$$scope*/ 8) {
    				button1_changes.$$scope = { dirty, ctx };
    			}

    			button1.$set(button1_changes);
    			const button2_changes = {};

    			if (dirty[1] & /*$$scope*/ 8) {
    				button2_changes.$$scope = { dirty, ctx };
    			}

    			button2.$set(button2_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(info.block);
    			transition_in(pagination.$$.fragment, local);
    			transition_in(button0.$$.fragment, local);
    			transition_in(button1.$$.fragment, local);
    			transition_in(button2.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			for (let i = 0; i < 3; i += 1) {
    				const block = info.blocks[i];
    				transition_out(block);
    			}

    			transition_out(pagination.$$.fragment, local);
    			transition_out(button0.$$.fragment, local);
    			transition_out(button1.$$.fragment, local);
    			transition_out(button2.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			info.block.d();
    			info.token = null;
    			info = null;
    			if (if_block) if_block.d();
    			destroy_component(pagination);
    			destroy_component(button0);
    			destroy_component(button1);
    			destroy_component(button2);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$d.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$d($$self, $$props, $$invalidate) {
    	let routes = [];

    	let newRoute = {
    		province: "",
    		year: "",
    		metropolitan: "",
    		urban: "",
    		rest: ""
    	};

    	//Variables para busqueda
    	let campo1 = "";

    	let valor1 = "";
    	let campo2 = "";
    	let valor2 = "";
    	let numberElementsPages = 10;
    	let offset = 0;
    	let pageActual = 1;
    	let moreData = true;
    	let msgOk = false;
    	onMount(getRoutes);

    	//onMount(getProvincesYears);
    	/*async function getProvincesYears() {
    	const res = await fetch("/api/v2/evolution-of-cycling-routes");
    	if (res.ok) {
    		const json = await res.json();
    		provinces = json.map((d) => {
    				return d.province;
    		});
    		provinces = Array.from(new Set(provinces)); 
    		years = json.map((d) => {
    				return d.year;
    		});
    		years = Array.from(new Set(years)); 
    		console.log("Counted " + provinces.length + "provinces and " + years.length + "years.");
    	} else {
    		console.log("ERROR!");
    	}
    }*/
    	// GET /evolution-of-cycling-routes
    	async function getRoutes() {
    		console.log("Fetching routes...");
    		const res = await fetch("/api/v2/evolution-of-cycling-routes?offset=" + numberElementsPages * offset + "&limit=" + numberElementsPages);
    		const resNext = await fetch("/api/v2/evolution-of-cycling-routes?offset=" + numberElementsPages * (offset + 1) + "&limit=" + numberElementsPages);

    		//const res = await fetch("/api/v2/evolution-of-cycling-routes");
    		if (res.ok && resNext.ok) {
    			console.log("Ok:");
    			const json = await res.json();
    			const jsonNext = await resNext.json();
    			$$invalidate(8, routes = json);

    			if (jsonNext.length == 0) {
    				$$invalidate(6, moreData = false);
    			} else {
    				$$invalidate(6, moreData = true);
    			}

    			console.log("Received " + routes.length + " routes.");
    		} else {
    			console.log("ERROR!");
    		}
    	}

    	// POST /evolution-of-cycling-routes
    	async function insertRoute() {
    		console.log("Inserting route..." + JSON.stringify(newRoute));

    		const res = await fetch("/api/v2/evolution-of-cycling-routes/", {
    			method: "POST",
    			body: JSON.stringify(newRoute),
    			headers: { "Content-Type": "application/json" }
    		}).then(function (res) {
    			getRoutes();

    			if (res.status == 201) {
    				$$invalidate(7, msgOk = "Recurso introducido correctamente");
    			} else if (res.status == 400) {
    				//Bad Request
    				$$invalidate(7, msgOk = false);

    				window.alert("ERROR: Todos los campos del recurso deben tener valor");
    			} else {
    				//ERROR 409 - Conflic
    				$$invalidate(7, msgOk = false);

    				window.alert("ERROR: El recurso introducido ya ha sido creado");
    			}
    		});
    	}

    	//	DELETE /evolution-of-cycling-routes
    	async function deleteRoutes() {
    		console.log("Deleting all routes...");

    		const res = await fetch("/api/v2/evolution-of-cycling-routes/", { method: "DELETE" }).then(function (res) {
    			getRoutes();

    			if (res.status == 200) {
    				$$invalidate(7, msgOk = "Datos borrados correctamente");
    			}
    		});
    	}

    	//	DELETE /evolution-of-cycling-routes/XXX/YYY
    	async function deleteRoute(province, year) {
    		console.log("Deleting one route...");

    		const res = await fetch("/api/v2/evolution-of-cycling-routes/" + province + "/" + year, { method: "DELETE" }).then(function (res) {
    			getRoutes();

    			if (res.status == 200) {
    				$$invalidate(7, msgOk = "Dato borrado correctamente");
    			}
    		});
    	}

    	// LOAD INITIAL DATA
    	async function loadInitialData() {
    		const res = await fetch("/api/v2/evolution-of-cycling-routes/loadInitialData", { method: "GET" }).then(function (res) {
    			getRoutes();

    			if (res.status == 200) {
    				$$invalidate(7, msgOk = "Datos iniciales cargados correctamente ");
    			}
    		});
    	}

    	//	SEARCH /evolution-of-cycling-routes	
    	async function searchRoutes(campo1, valor1, campo2, valor2) {
    		offset = 0;
    		$$invalidate(5, pageActual = 1);
    		$$invalidate(6, moreData = false);
    		console.log("Searching data: " + campo1 + ": " + valor1 + ", " + campo2 + ": " + valor2);
    		var url = "/api/v2/evolution-of-cycling-routes";

    		if (campo1 != "" && campo2 != "" && valor1 != "" && valor2 != "") {
    			url = url + "?" + campo1 + "=" + valor1 + "&" + campo2 + "=" + valor2;
    		} else if (campo1 == "" && campo2 != "" && valor2 != "") {
    			url = url + "?" + campo2 + "=" + valor2;
    		} else if (campo1 != "" && campo2 == "" && valor1 != "") {
    			url = url + "?" + campo1 + "=" + valor1;
    		}

    		console.log("la url es: " + url);
    		const res = await fetch(url);

    		if (res.ok) {
    			console.log("Ok:");
    			const json = await res.json();
    			$$invalidate(8, routes = json);
    			console.log("Found " + routes.length + " routes.");

    			if (routes.length > 0) {
    				$$invalidate(7, msgOk = res.status + ": " + res.statusText + ". Búsqueda realizada con éxito");
    			} else {
    				$$invalidate(7, msgOk = res.status + ": " + res.statusText + ". Búsqueda realizada con éxito. 0 elementos encontrados");
    			}
    		} else {
    			$$invalidate(7, msgOk = false);
    			window.alert("ERROR: Compruebe que ha insertado valores correctos para la búsqueda");
    			console.log("ERROR!");
    		}
    	}

    	//	OFFSET
    	function addOffset(increment) {
    		offset += increment;
    		$$invalidate(5, pageActual += increment);
    		getRoutes();
    	}

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console_1$2.warn(`<CyclingRoutesTable> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("CyclingRoutesTable", $$slots, []);

    	function input0_value_binding(value) {
    		campo1 = value;
    		$$invalidate(1, campo1);
    	}

    	function input1_value_binding(value) {
    		valor1 = value;
    		$$invalidate(2, valor1);
    	}

    	function input2_value_binding(value) {
    		campo2 = value;
    		$$invalidate(3, campo2);
    	}

    	function input3_value_binding(value) {
    		valor2 = value;
    		$$invalidate(4, valor2);
    	}

    	function input0_value_binding_1(value) {
    		newRoute.province = value;
    		$$invalidate(0, newRoute);
    	}

    	function input1_value_binding_1(value) {
    		newRoute.year = value;
    		$$invalidate(0, newRoute);
    	}

    	function input2_value_binding_1(value) {
    		newRoute.metropolitan = value;
    		$$invalidate(0, newRoute);
    	}

    	function input3_value_binding_1(value) {
    		newRoute.urban = value;
    		$$invalidate(0, newRoute);
    	}

    	function input4_value_binding(value) {
    		newRoute.rest = value;
    		$$invalidate(0, newRoute);
    	}

    	const click_handler = () => addOffset(-1);
    	const click_handler_1 = () => addOffset(-1);
    	const click_handler_2 = () => addOffset(1);
    	const click_handler_3 = () => addOffset(1);

    	$$self.$capture_state = () => ({
    		onMount,
    		pop,
    		Table,
    		Button,
    		Input,
    		Label,
    		FormGroup,
    		Pagination,
    		PaginationItem,
    		PaginationLink,
    		routes,
    		newRoute,
    		campo1,
    		valor1,
    		campo2,
    		valor2,
    		numberElementsPages,
    		offset,
    		pageActual,
    		moreData,
    		msgOk,
    		getRoutes,
    		insertRoute,
    		deleteRoutes,
    		deleteRoute,
    		loadInitialData,
    		searchRoutes,
    		addOffset
    	});

    	$$self.$inject_state = $$props => {
    		if ("routes" in $$props) $$invalidate(8, routes = $$props.routes);
    		if ("newRoute" in $$props) $$invalidate(0, newRoute = $$props.newRoute);
    		if ("campo1" in $$props) $$invalidate(1, campo1 = $$props.campo1);
    		if ("valor1" in $$props) $$invalidate(2, valor1 = $$props.valor1);
    		if ("campo2" in $$props) $$invalidate(3, campo2 = $$props.campo2);
    		if ("valor2" in $$props) $$invalidate(4, valor2 = $$props.valor2);
    		if ("numberElementsPages" in $$props) numberElementsPages = $$props.numberElementsPages;
    		if ("offset" in $$props) offset = $$props.offset;
    		if ("pageActual" in $$props) $$invalidate(5, pageActual = $$props.pageActual);
    		if ("moreData" in $$props) $$invalidate(6, moreData = $$props.moreData);
    		if ("msgOk" in $$props) $$invalidate(7, msgOk = $$props.msgOk);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		newRoute,
    		campo1,
    		valor1,
    		campo2,
    		valor2,
    		pageActual,
    		moreData,
    		msgOk,
    		routes,
    		insertRoute,
    		deleteRoutes,
    		deleteRoute,
    		loadInitialData,
    		searchRoutes,
    		addOffset,
    		offset,
    		numberElementsPages,
    		getRoutes,
    		input0_value_binding,
    		input1_value_binding,
    		input2_value_binding,
    		input3_value_binding,
    		input0_value_binding_1,
    		input1_value_binding_1,
    		input2_value_binding_1,
    		input3_value_binding_1,
    		input4_value_binding,
    		click_handler,
    		click_handler_1,
    		click_handler_2,
    		click_handler_3
    	];
    }

    class CyclingRoutesTable extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$d, create_fragment$d, safe_not_equal, {}, [-1, -1]);

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "CyclingRoutesTable",
    			options,
    			id: create_fragment$d.name
    		});
    	}
    }

    /* src\front\routesAPI\EditCyclingRoute.svelte generated by Svelte v3.21.0 */

    const { console: console_1$3 } = globals;
    const file$b = "src\\front\\routesAPI\\EditCyclingRoute.svelte";

    // (1:0) <script>   import {onMount}
    function create_catch_block$1(ctx) {
    	const block = {
    		c: noop,
    		m: noop,
    		p: noop,
    		i: noop,
    		o: noop,
    		d: noop
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_catch_block$1.name,
    		type: "catch",
    		source: "(1:0) <script>   import {onMount}",
    		ctx
    	});

    	return block;
    }

    // (70:1) {:then route}
    function create_then_block$1(ctx) {
    	let current;

    	const table = new Table({
    			props: {
    				bordered: true,
    				$$slots: { default: [create_default_slot_1$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(table.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(table, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const table_changes = {};

    			if (dirty & /*$$scope, updatedRest, updatedUrban, updatedMetropolitan, updatedYear, updatedProvince*/ 16446) {
    				table_changes.$$scope = { dirty, ctx };
    			}

    			table.$set(table_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(table.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(table.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(table, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_then_block$1.name,
    		type: "then",
    		source: "(70:1) {:then route}",
    		ctx
    	});

    	return block;
    }

    // (89:11) <Button style="margin-bottom:3%;" color="primary" on:click={updateRoute}>
    function create_default_slot_2$1(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Actualizar");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_2$1.name,
    		type: "slot",
    		source: "(89:11) <Button style=\\\"margin-bottom:3%;\\\" color=\\\"primary\\\" on:click={updateRoute}>",
    		ctx
    	});

    	return block;
    }

    // (71:3) <Table bordered>
    function create_default_slot_1$1(ctx) {
    	let thead;
    	let tr0;
    	let th0;
    	let t1;
    	let th1;
    	let t3;
    	let th2;
    	let t5;
    	let th3;
    	let t7;
    	let th4;
    	let t9;
    	let th5;
    	let t11;
    	let tbody;
    	let tr1;
    	let td0;
    	let t12;
    	let t13;
    	let td1;
    	let t14;
    	let t15;
    	let td2;
    	let updating_value;
    	let t16;
    	let td3;
    	let updating_value_1;
    	let t17;
    	let td4;
    	let updating_value_2;
    	let t18;
    	let td5;
    	let current;

    	function input0_value_binding(value) {
    		/*input0_value_binding*/ ctx[11].call(null, value);
    	}

    	let input0_props = { type: "number" };

    	if (/*updatedMetropolitan*/ ctx[3] !== void 0) {
    		input0_props.value = /*updatedMetropolitan*/ ctx[3];
    	}

    	const input0 = new Input({ props: input0_props, $$inline: true });
    	binding_callbacks.push(() => bind(input0, "value", input0_value_binding));

    	function input1_value_binding(value) {
    		/*input1_value_binding*/ ctx[12].call(null, value);
    	}

    	let input1_props = { type: "number" };

    	if (/*updatedUrban*/ ctx[4] !== void 0) {
    		input1_props.value = /*updatedUrban*/ ctx[4];
    	}

    	const input1 = new Input({ props: input1_props, $$inline: true });
    	binding_callbacks.push(() => bind(input1, "value", input1_value_binding));

    	function input2_value_binding(value) {
    		/*input2_value_binding*/ ctx[13].call(null, value);
    	}

    	let input2_props = { type: "number" };

    	if (/*updatedRest*/ ctx[5] !== void 0) {
    		input2_props.value = /*updatedRest*/ ctx[5];
    	}

    	const input2 = new Input({ props: input2_props, $$inline: true });
    	binding_callbacks.push(() => bind(input2, "value", input2_value_binding));

    	const button = new Button({
    			props: {
    				style: "margin-bottom:3%;",
    				color: "primary",
    				$$slots: { default: [create_default_slot_2$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	button.$on("click", /*updateRoute*/ ctx[9]);

    	const block = {
    		c: function create() {
    			thead = element("thead");
    			tr0 = element("tr");
    			th0 = element("th");
    			th0.textContent = "Provincia";
    			t1 = space();
    			th1 = element("th");
    			th1.textContent = "Año";
    			t3 = space();
    			th2 = element("th");
    			th2.textContent = "Metropolitano";
    			t5 = space();
    			th3 = element("th");
    			th3.textContent = "Urbano";
    			t7 = space();
    			th4 = element("th");
    			th4.textContent = "Resto";
    			t9 = space();
    			th5 = element("th");
    			th5.textContent = "Acciones";
    			t11 = space();
    			tbody = element("tbody");
    			tr1 = element("tr");
    			td0 = element("td");
    			t12 = text(/*updatedProvince*/ ctx[1]);
    			t13 = space();
    			td1 = element("td");
    			t14 = text(/*updatedYear*/ ctx[2]);
    			t15 = space();
    			td2 = element("td");
    			create_component(input0.$$.fragment);
    			t16 = space();
    			td3 = element("td");
    			create_component(input1.$$.fragment);
    			t17 = space();
    			td4 = element("td");
    			create_component(input2.$$.fragment);
    			t18 = space();
    			td5 = element("td");
    			create_component(button.$$.fragment);
    			add_location(th0, file$b, 73, 6, 1996);
    			add_location(th1, file$b, 74, 6, 2022);
    			add_location(th2, file$b, 75, 6, 2042);
    			add_location(th3, file$b, 76, 6, 2072);
    			add_location(th4, file$b, 77, 6, 2095);
    			add_location(th5, file$b, 78, 6, 2117);
    			add_location(tr0, file$b, 72, 5, 1984);
    			add_location(thead, file$b, 71, 4, 1970);
    			add_location(td0, file$b, 83, 6, 2192);
    			add_location(td1, file$b, 84, 6, 2226);
    			add_location(td2, file$b, 85, 6, 2276);
    			add_location(td3, file$b, 86, 6, 2350);
    			add_location(td4, file$b, 87, 6, 2417);
    			add_location(td5, file$b, 88, 6, 2483);
    			add_location(tr1, file$b, 82, 5, 2180);
    			add_location(tbody, file$b, 81, 4, 2166);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, thead, anchor);
    			append_dev(thead, tr0);
    			append_dev(tr0, th0);
    			append_dev(tr0, t1);
    			append_dev(tr0, th1);
    			append_dev(tr0, t3);
    			append_dev(tr0, th2);
    			append_dev(tr0, t5);
    			append_dev(tr0, th3);
    			append_dev(tr0, t7);
    			append_dev(tr0, th4);
    			append_dev(tr0, t9);
    			append_dev(tr0, th5);
    			insert_dev(target, t11, anchor);
    			insert_dev(target, tbody, anchor);
    			append_dev(tbody, tr1);
    			append_dev(tr1, td0);
    			append_dev(td0, t12);
    			append_dev(tr1, t13);
    			append_dev(tr1, td1);
    			append_dev(td1, t14);
    			append_dev(tr1, t15);
    			append_dev(tr1, td2);
    			mount_component(input0, td2, null);
    			append_dev(tr1, t16);
    			append_dev(tr1, td3);
    			mount_component(input1, td3, null);
    			append_dev(tr1, t17);
    			append_dev(tr1, td4);
    			mount_component(input2, td4, null);
    			append_dev(tr1, t18);
    			append_dev(tr1, td5);
    			mount_component(button, td5, null);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (!current || dirty & /*updatedProvince*/ 2) set_data_dev(t12, /*updatedProvince*/ ctx[1]);
    			if (!current || dirty & /*updatedYear*/ 4) set_data_dev(t14, /*updatedYear*/ ctx[2]);
    			const input0_changes = {};

    			if (!updating_value && dirty & /*updatedMetropolitan*/ 8) {
    				updating_value = true;
    				input0_changes.value = /*updatedMetropolitan*/ ctx[3];
    				add_flush_callback(() => updating_value = false);
    			}

    			input0.$set(input0_changes);
    			const input1_changes = {};

    			if (!updating_value_1 && dirty & /*updatedUrban*/ 16) {
    				updating_value_1 = true;
    				input1_changes.value = /*updatedUrban*/ ctx[4];
    				add_flush_callback(() => updating_value_1 = false);
    			}

    			input1.$set(input1_changes);
    			const input2_changes = {};

    			if (!updating_value_2 && dirty & /*updatedRest*/ 32) {
    				updating_value_2 = true;
    				input2_changes.value = /*updatedRest*/ ctx[5];
    				add_flush_callback(() => updating_value_2 = false);
    			}

    			input2.$set(input2_changes);
    			const button_changes = {};

    			if (dirty & /*$$scope*/ 16384) {
    				button_changes.$$scope = { dirty, ctx };
    			}

    			button.$set(button_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(input0.$$.fragment, local);
    			transition_in(input1.$$.fragment, local);
    			transition_in(input2.$$.fragment, local);
    			transition_in(button.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(input0.$$.fragment, local);
    			transition_out(input1.$$.fragment, local);
    			transition_out(input2.$$.fragment, local);
    			transition_out(button.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(thead);
    			if (detaching) detach_dev(t11);
    			if (detaching) detach_dev(tbody);
    			destroy_component(input0);
    			destroy_component(input1);
    			destroy_component(input2);
    			destroy_component(button);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1$1.name,
    		type: "slot",
    		source: "(71:3) <Table bordered>",
    		ctx
    	});

    	return block;
    }

    // (68:15)     Loading routes...   {:then route}
    function create_pending_block$1(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Loading routes...");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_pending_block$1.name,
    		type: "pending",
    		source: "(68:15)     Loading routes...   {:then route}",
    		ctx
    	});

    	return block;
    }

    // (95:1) {#if msgBad}
    function create_if_block_1$3(ctx) {
    	let p;
    	let t0;
    	let t1;

    	const block = {
    		c: function create() {
    			p = element("p");
    			t0 = text("ERROR: ");
    			t1 = text(/*msgBad*/ ctx[7]);
    			set_style(p, "color", "red");
    			add_location(p, file$b, 95, 1, 2691);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, p, anchor);
    			append_dev(p, t0);
    			append_dev(p, t1);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*msgBad*/ 128) set_data_dev(t1, /*msgBad*/ ctx[7]);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(p);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$3.name,
    		type: "if",
    		source: "(95:1) {#if msgBad}",
    		ctx
    	});

    	return block;
    }

    // (98:1) {#if msgOk}
    function create_if_block$7(ctx) {
    	let p;
    	let t0;
    	let t1;

    	const block = {
    		c: function create() {
    			p = element("p");
    			t0 = text("EXITO: ");
    			t1 = text(/*msgOk*/ ctx[6]);
    			set_style(p, "color", "green");
    			add_location(p, file$b, 98, 1, 2757);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, p, anchor);
    			append_dev(p, t0);
    			append_dev(p, t1);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*msgOk*/ 64) set_data_dev(t1, /*msgOk*/ ctx[6]);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(p);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$7.name,
    		type: "if",
    		source: "(98:1) {#if msgOk}",
    		ctx
    	});

    	return block;
    }

    // (101:2) <Button outline color="secondary" on:click="{pop}">
    function create_default_slot$1(ctx) {
    	let i;

    	const block = {
    		c: function create() {
    			i = element("i");
    			attr_dev(i, "class", "fas fa-arrow-circle-left");
    			add_location(i, file$b, 100, 54, 2863);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, i, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(i);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$1.name,
    		type: "slot",
    		source: "(101:2) <Button outline color=\\\"secondary\\\" on:click=\\\"{pop}\\\">",
    		ctx
    	});

    	return block;
    }

    function create_fragment$e(ctx) {
    	let main;
    	let h3;
    	let t0;
    	let strong;
    	let t1_value = /*params*/ ctx[0].province + "";
    	let t1;
    	let t2;
    	let t3_value = /*params*/ ctx[0].year + "";
    	let t3;
    	let t4;
    	let promise;
    	let t5;
    	let t6;
    	let t7;
    	let current;

    	let info = {
    		ctx,
    		current: null,
    		token: null,
    		pending: create_pending_block$1,
    		then: create_then_block$1,
    		catch: create_catch_block$1,
    		value: 8,
    		blocks: [,,,]
    	};

    	handle_promise(promise = /*route*/ ctx[8], info);
    	let if_block0 = /*msgBad*/ ctx[7] && create_if_block_1$3(ctx);
    	let if_block1 = /*msgOk*/ ctx[6] && create_if_block$7(ctx);

    	const button = new Button({
    			props: {
    				outline: true,
    				color: "secondary",
    				$$slots: { default: [create_default_slot$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	button.$on("click", pop);

    	const block = {
    		c: function create() {
    			main = element("main");
    			h3 = element("h3");
    			t0 = text("Editar Carril Bici ");
    			strong = element("strong");
    			t1 = text(t1_value);
    			t2 = text(" - ");
    			t3 = text(t3_value);
    			t4 = space();
    			info.block.c();
    			t5 = space();
    			if (if_block0) if_block0.c();
    			t6 = space();
    			if (if_block1) if_block1.c();
    			t7 = space();
    			create_component(button.$$.fragment);
    			add_location(strong, file$b, 66, 53, 1834);
    			set_style(h3, "text-align", "center");
    			add_location(h3, file$b, 66, 2, 1783);
    			add_location(main, file$b, 65, 1, 1773);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			append_dev(main, h3);
    			append_dev(h3, t0);
    			append_dev(h3, strong);
    			append_dev(strong, t1);
    			append_dev(strong, t2);
    			append_dev(strong, t3);
    			append_dev(main, t4);
    			info.block.m(main, info.anchor = null);
    			info.mount = () => main;
    			info.anchor = t5;
    			append_dev(main, t5);
    			if (if_block0) if_block0.m(main, null);
    			append_dev(main, t6);
    			if (if_block1) if_block1.m(main, null);
    			append_dev(main, t7);
    			mount_component(button, main, null);
    			current = true;
    		},
    		p: function update(new_ctx, [dirty]) {
    			ctx = new_ctx;
    			if ((!current || dirty & /*params*/ 1) && t1_value !== (t1_value = /*params*/ ctx[0].province + "")) set_data_dev(t1, t1_value);
    			if ((!current || dirty & /*params*/ 1) && t3_value !== (t3_value = /*params*/ ctx[0].year + "")) set_data_dev(t3, t3_value);
    			info.ctx = ctx;

    			if (dirty & /*route*/ 256 && promise !== (promise = /*route*/ ctx[8]) && handle_promise(promise, info)) ; else {
    				const child_ctx = ctx.slice();
    				child_ctx[8] = info.resolved;
    				info.block.p(child_ctx, dirty);
    			}

    			if (/*msgBad*/ ctx[7]) {
    				if (if_block0) {
    					if_block0.p(ctx, dirty);
    				} else {
    					if_block0 = create_if_block_1$3(ctx);
    					if_block0.c();
    					if_block0.m(main, t6);
    				}
    			} else if (if_block0) {
    				if_block0.d(1);
    				if_block0 = null;
    			}

    			if (/*msgOk*/ ctx[6]) {
    				if (if_block1) {
    					if_block1.p(ctx, dirty);
    				} else {
    					if_block1 = create_if_block$7(ctx);
    					if_block1.c();
    					if_block1.m(main, t7);
    				}
    			} else if (if_block1) {
    				if_block1.d(1);
    				if_block1 = null;
    			}

    			const button_changes = {};

    			if (dirty & /*$$scope*/ 16384) {
    				button_changes.$$scope = { dirty, ctx };
    			}

    			button.$set(button_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(info.block);
    			transition_in(button.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			for (let i = 0; i < 3; i += 1) {
    				const block = info.blocks[i];
    				transition_out(block);
    			}

    			transition_out(button.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			info.block.d();
    			info.token = null;
    			info = null;
    			if (if_block0) if_block0.d();
    			if (if_block1) if_block1.d();
    			destroy_component(button);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$e.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$e($$self, $$props, $$invalidate) {
    	let { params = {} } = $$props;
    	let route = {};
    	let updatedProvince = "";
    	let updatedYear = 0;
    	let updatedMetropolitan = 0;
    	let updatedUrban = 0;
    	let updatedRest = 0;
    	let msgOk = false;
    	let msgBad = false;
    	onMount(getRoute);

    	async function getRoute() {
    		console.log("Fetching routes...");
    		const res = await fetch("/api/v2/evolution-of-cycling-routes/" + params.province + "/" + params.year);

    		if (res.ok) {
    			console.log("Ok:");
    			const json = await res.json();
    			$$invalidate(8, route = json);
    			$$invalidate(1, updatedProvince = route.province);
    			$$invalidate(2, updatedYear = route.year);
    			$$invalidate(3, updatedMetropolitan = route.metropolitan);
    			$$invalidate(4, updatedUrban = route.urban);
    			$$invalidate(5, updatedRest = route.rest);
    			console.log("Data loaded");
    		} else {
    			console.log("ERROR!");
    		}
    	}

    	async function updateRoute() {
    		console.log("Updating routes...");

    		const res = await fetch("/api/v2/evolution-of-cycling-routes/" + params.province + "/" + params.year, {
    			method: "PUT",
    			body: JSON.stringify({
    				province: params.province,
    				year: parseInt(params.year),
    				"metropolitan": updatedMetropolitan,
    				"urban": updatedUrban,
    				"rest": updatedRest
    			}),
    			headers: { "Content-Type": "application/json" }
    		}).then(function (res) {
    			getRoute();

    			if (res.status == 200) {
    				$$invalidate(6, msgOk = "Dato actualizado correctamente");
    				$$invalidate(7, msgBad = false);
    			} else {
    				$$invalidate(6, msgOk = false);
    				$$invalidate(7, msgBad = "Todos los campos deben tener valor");
    			}
    		});
    	}

    	const writable_props = ["params"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console_1$3.warn(`<EditCyclingRoute> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("EditCyclingRoute", $$slots, []);

    	function input0_value_binding(value) {
    		updatedMetropolitan = value;
    		$$invalidate(3, updatedMetropolitan);
    	}

    	function input1_value_binding(value) {
    		updatedUrban = value;
    		$$invalidate(4, updatedUrban);
    	}

    	function input2_value_binding(value) {
    		updatedRest = value;
    		$$invalidate(5, updatedRest);
    	}

    	$$self.$set = $$props => {
    		if ("params" in $$props) $$invalidate(0, params = $$props.params);
    	};

    	$$self.$capture_state = () => ({
    		onMount,
    		pop,
    		Table,
    		Button,
    		Input,
    		params,
    		route,
    		updatedProvince,
    		updatedYear,
    		updatedMetropolitan,
    		updatedUrban,
    		updatedRest,
    		msgOk,
    		msgBad,
    		getRoute,
    		updateRoute
    	});

    	$$self.$inject_state = $$props => {
    		if ("params" in $$props) $$invalidate(0, params = $$props.params);
    		if ("route" in $$props) $$invalidate(8, route = $$props.route);
    		if ("updatedProvince" in $$props) $$invalidate(1, updatedProvince = $$props.updatedProvince);
    		if ("updatedYear" in $$props) $$invalidate(2, updatedYear = $$props.updatedYear);
    		if ("updatedMetropolitan" in $$props) $$invalidate(3, updatedMetropolitan = $$props.updatedMetropolitan);
    		if ("updatedUrban" in $$props) $$invalidate(4, updatedUrban = $$props.updatedUrban);
    		if ("updatedRest" in $$props) $$invalidate(5, updatedRest = $$props.updatedRest);
    		if ("msgOk" in $$props) $$invalidate(6, msgOk = $$props.msgOk);
    		if ("msgBad" in $$props) $$invalidate(7, msgBad = $$props.msgBad);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		params,
    		updatedProvince,
    		updatedYear,
    		updatedMetropolitan,
    		updatedUrban,
    		updatedRest,
    		msgOk,
    		msgBad,
    		route,
    		updateRoute,
    		getRoute,
    		input0_value_binding,
    		input1_value_binding,
    		input2_value_binding
    	];
    }

    class EditCyclingRoute extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$e, create_fragment$e, safe_not_equal, { params: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "EditCyclingRoute",
    			options,
    			id: create_fragment$e.name
    		});
    	}

    	get params() {
    		throw new Error("<EditCyclingRoute>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set params(value) {
    		throw new Error("<EditCyclingRoute>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\front\tourismAPI\TourismTable.svelte.html generated by Svelte v3.21.0 */

    const { console: console_1$4 } = globals;
    const file$c = "src\\front\\tourismAPI\\TourismTable.svelte.html";

    function get_each_context$1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[31] = list[i];
    	return child_ctx;
    }

    // (162:2) <Button outline  color="primary" on:click={loadInitialData}>
    function create_default_slot_18$1(ctx) {
    	let i;
    	let t;

    	const block = {
    		c: function create() {
    			i = element("i");
    			t = text(" Inicializar");
    			attr_dev(i, "class", "fas fa-spinner");
    			add_location(i, file$c, 161, 62, 5004);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, i, anchor);
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(i);
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_18$1.name,
    		type: "slot",
    		source: "(162:2) <Button outline  color=\\\"primary\\\" on:click={loadInitialData}>",
    		ctx
    	});

    	return block;
    }

    // (163:2) <Button outline  color="danger" on:click={deleteAllTourism}>
    function create_default_slot_17$1(ctx) {
    	let i;
    	let t;

    	const block = {
    		c: function create() {
    			i = element("i");
    			t = text(" Eliminar todo");
    			attr_dev(i, "class", "fa fa-trash");
    			attr_dev(i, "aria-hidden", "true");
    			add_location(i, file$c, 162, 62, 5119);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, i, anchor);
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(i);
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_17$1.name,
    		type: "slot",
    		source: "(163:2) <Button outline  color=\\\"danger\\\" on:click={deleteAllTourism}>",
    		ctx
    	});

    	return block;
    }

    // (1:0) <script>      import {          onMount      }
    function create_catch_block$2(ctx) {
    	const block = {
    		c: noop,
    		m: noop,
    		p: noop,
    		i: noop,
    		o: noop,
    		d: noop
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_catch_block$2.name,
    		type: "catch",
    		source: "(1:0) <script>      import {          onMount      }",
    		ctx
    	});

    	return block;
    }

    // (168:4) {:then tourism}
    function create_then_block$2(ctx) {
    	let t0;
    	let t1;
    	let t2;
    	let h3;
    	let t4;
    	let current;

    	const formgroup = new FormGroup({
    			props: {
    				$$slots: { default: [create_default_slot_14$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const button = new Button({
    			props: {
    				style: "margin-bottom:3%;",
    				color: "primary",
    				class: "button-search",
    				$$slots: { default: [create_default_slot_13$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	button.$on("click", function () {
    		if (is_function(/*busqueda*/ ctx[14](/*campo1*/ ctx[3], /*valor1*/ ctx[4], /*campo2*/ ctx[5], /*valor2*/ ctx[6]))) /*busqueda*/ ctx[14](/*campo1*/ ctx[3], /*valor1*/ ctx[4], /*campo2*/ ctx[5], /*valor2*/ ctx[6]).apply(this, arguments);
    	});

    	const table0 = new Table({
    			props: {
    				bordered: true,
    				$$slots: { default: [create_default_slot_11$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const table1 = new Table({
    			props: {
    				style: "background-color:#EAEEF0;",
    				$$slots: { default: [create_default_slot_9$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(formgroup.$$.fragment);
    			t0 = space();
    			create_component(button.$$.fragment);
    			t1 = space();
    			create_component(table0.$$.fragment);
    			t2 = space();
    			h3 = element("h3");
    			h3.textContent = "Añadir nuevo dato:";
    			t4 = space();
    			create_component(table1.$$.fragment);
    			add_location(h3, file$c, 243, 2, 7766);
    		},
    		m: function mount(target, anchor) {
    			mount_component(formgroup, target, anchor);
    			insert_dev(target, t0, anchor);
    			mount_component(button, target, anchor);
    			insert_dev(target, t1, anchor);
    			mount_component(table0, target, anchor);
    			insert_dev(target, t2, anchor);
    			insert_dev(target, h3, anchor);
    			insert_dev(target, t4, anchor);
    			mount_component(table1, target, anchor);
    			current = true;
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			const formgroup_changes = {};

    			if (dirty[0] & /*valor2, campo2, valor1, campo1*/ 120 | dirty[1] & /*$$scope*/ 8) {
    				formgroup_changes.$$scope = { dirty, ctx };
    			}

    			formgroup.$set(formgroup_changes);
    			const button_changes = {};

    			if (dirty[1] & /*$$scope*/ 8) {
    				button_changes.$$scope = { dirty, ctx };
    			}

    			button.$set(button_changes);
    			const table0_changes = {};

    			if (dirty[0] & /*tourism*/ 256 | dirty[1] & /*$$scope*/ 8) {
    				table0_changes.$$scope = { dirty, ctx };
    			}

    			table0.$set(table0_changes);
    			const table1_changes = {};

    			if (dirty[0] & /*newTourism*/ 1 | dirty[1] & /*$$scope*/ 8) {
    				table1_changes.$$scope = { dirty, ctx };
    			}

    			table1.$set(table1_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(formgroup.$$.fragment, local);
    			transition_in(button.$$.fragment, local);
    			transition_in(table0.$$.fragment, local);
    			transition_in(table1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(formgroup.$$.fragment, local);
    			transition_out(button.$$.fragment, local);
    			transition_out(table0.$$.fragment, local);
    			transition_out(table1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(formgroup, detaching);
    			if (detaching) detach_dev(t0);
    			destroy_component(button, detaching);
    			if (detaching) detach_dev(t1);
    			destroy_component(table0, detaching);
    			if (detaching) detach_dev(t2);
    			if (detaching) detach_dev(h3);
    			if (detaching) detach_dev(t4);
    			destroy_component(table1, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_then_block$2.name,
    		type: "then",
    		source: "(168:4) {:then tourism}",
    		ctx
    	});

    	return block;
    }

    // (176:6) <Input type="select" name="inputCampo" id="inputCampo" bind:value="{campo1}">
    function create_default_slot_16$1(ctx) {
    	let option0;
    	let t0;
    	let option1;
    	let t2;
    	let option2;
    	let t4;
    	let option3;
    	let t6;
    	let option4;
    	let t8;
    	let option5;

    	const block = {
    		c: function create() {
    			option0 = element("option");
    			t0 = space();
    			option1 = element("option");
    			option1.textContent = "Provincia";
    			t2 = space();
    			option2 = element("option");
    			option2.textContent = "Año";
    			t4 = space();
    			option3 = element("option");
    			option3.textContent = "Viajero";
    			t6 = space();
    			option4 = element("option");
    			option4.textContent = "Pernoctación";
    			t8 = space();
    			option5 = element("option");
    			option5.textContent = "Estancia media";
    			option0.disabled = true;
    			option0.selected = true;
    			option0.__value = "";
    			option0.value = option0.__value;
    			add_location(option0, file$c, 176, 7, 5452);
    			option1.__value = "province";
    			option1.value = option1.__value;
    			add_location(option1, file$c, 177, 7, 5496);
    			option2.__value = "year";
    			option2.value = option2.__value;
    			add_location(option2, file$c, 178, 7, 5548);
    			option3.__value = "traveller";
    			option3.value = option3.__value;
    			add_location(option3, file$c, 179, 7, 5590);
    			option4.__value = "overnightstay";
    			option4.value = option4.__value;
    			add_location(option4, file$c, 180, 7, 5641);
    			option5.__value = "averagestay";
    			option5.value = option5.__value;
    			add_location(option5, file$c, 181, 7, 5701);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, option0, anchor);
    			insert_dev(target, t0, anchor);
    			insert_dev(target, option1, anchor);
    			insert_dev(target, t2, anchor);
    			insert_dev(target, option2, anchor);
    			insert_dev(target, t4, anchor);
    			insert_dev(target, option3, anchor);
    			insert_dev(target, t6, anchor);
    			insert_dev(target, option4, anchor);
    			insert_dev(target, t8, anchor);
    			insert_dev(target, option5, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(option0);
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(option1);
    			if (detaching) detach_dev(t2);
    			if (detaching) detach_dev(option2);
    			if (detaching) detach_dev(t4);
    			if (detaching) detach_dev(option3);
    			if (detaching) detach_dev(t6);
    			if (detaching) detach_dev(option4);
    			if (detaching) detach_dev(t8);
    			if (detaching) detach_dev(option5);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_16$1.name,
    		type: "slot",
    		source: "(176:6) <Input type=\\\"select\\\" name=\\\"inputCampo\\\" id=\\\"inputCampo\\\" bind:value=\\\"{campo1}\\\">",
    		ctx
    	});

    	return block;
    }

    // (194:6) <Input type="select" name="inputCampo" id="inputCampo" bind:value="{campo2}">
    function create_default_slot_15$1(ctx) {
    	let option0;
    	let t0;
    	let option1;
    	let t2;
    	let option2;
    	let t4;
    	let option3;
    	let t6;
    	let option4;
    	let t8;
    	let option5;

    	const block = {
    		c: function create() {
    			option0 = element("option");
    			t0 = space();
    			option1 = element("option");
    			option1.textContent = "Provincia";
    			t2 = space();
    			option2 = element("option");
    			option2.textContent = "Año";
    			t4 = space();
    			option3 = element("option");
    			option3.textContent = "Viajero";
    			t6 = space();
    			option4 = element("option");
    			option4.textContent = "Pernoctación";
    			t8 = space();
    			option5 = element("option");
    			option5.textContent = "Estancia media";
    			option0.disabled = true;
    			option0.selected = true;
    			option0.__value = "";
    			option0.value = option0.__value;
    			add_location(option0, file$c, 194, 7, 6091);
    			option1.__value = "province";
    			option1.value = option1.__value;
    			add_location(option1, file$c, 195, 7, 6135);
    			option2.__value = "year";
    			option2.value = option2.__value;
    			add_location(option2, file$c, 196, 7, 6187);
    			option3.__value = "traveller";
    			option3.value = option3.__value;
    			add_location(option3, file$c, 197, 7, 6229);
    			option4.__value = "overnightstay";
    			option4.value = option4.__value;
    			add_location(option4, file$c, 198, 7, 6280);
    			option5.__value = "averagestay";
    			option5.value = option5.__value;
    			add_location(option5, file$c, 199, 7, 6340);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, option0, anchor);
    			insert_dev(target, t0, anchor);
    			insert_dev(target, option1, anchor);
    			insert_dev(target, t2, anchor);
    			insert_dev(target, option2, anchor);
    			insert_dev(target, t4, anchor);
    			insert_dev(target, option3, anchor);
    			insert_dev(target, t6, anchor);
    			insert_dev(target, option4, anchor);
    			insert_dev(target, t8, anchor);
    			insert_dev(target, option5, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(option0);
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(option1);
    			if (detaching) detach_dev(t2);
    			if (detaching) detach_dev(option2);
    			if (detaching) detach_dev(t4);
    			if (detaching) detach_dev(option3);
    			if (detaching) detach_dev(t6);
    			if (detaching) detach_dev(option4);
    			if (detaching) detach_dev(t8);
    			if (detaching) detach_dev(option5);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_15$1.name,
    		type: "slot",
    		source: "(194:6) <Input type=\\\"select\\\" name=\\\"inputCampo\\\" id=\\\"inputCampo\\\" bind:value=\\\"{campo2}\\\">",
    		ctx
    	});

    	return block;
    }

    // (171:2) <FormGroup>
    function create_default_slot_14$1(ctx) {
    	let table;
    	let tr0;
    	let td0;
    	let label0;
    	let t1;
    	let updating_value;
    	let t2;
    	let td1;
    	let label1;
    	let t4;
    	let updating_value_1;
    	let t5;
    	let tr1;
    	let td2;
    	let label2;
    	let t7;
    	let updating_value_2;
    	let t8;
    	let td3;
    	let label3;
    	let t10;
    	let updating_value_3;
    	let current;

    	function input0_value_binding(value) {
    		/*input0_value_binding*/ ctx[18].call(null, value);
    	}

    	let input0_props = {
    		type: "select",
    		name: "inputCampo",
    		id: "inputCampo",
    		$$slots: { default: [create_default_slot_16$1] },
    		$$scope: { ctx }
    	};

    	if (/*campo1*/ ctx[3] !== void 0) {
    		input0_props.value = /*campo1*/ ctx[3];
    	}

    	const input0 = new Input({ props: input0_props, $$inline: true });
    	binding_callbacks.push(() => bind(input0, "value", input0_value_binding));

    	function input1_value_binding(value) {
    		/*input1_value_binding*/ ctx[19].call(null, value);
    	}

    	let input1_props = {
    		type: "text",
    		name: "inputValor",
    		id: "inputValor"
    	};

    	if (/*valor1*/ ctx[4] !== void 0) {
    		input1_props.value = /*valor1*/ ctx[4];
    	}

    	const input1 = new Input({ props: input1_props, $$inline: true });
    	binding_callbacks.push(() => bind(input1, "value", input1_value_binding));

    	function input2_value_binding(value) {
    		/*input2_value_binding*/ ctx[20].call(null, value);
    	}

    	let input2_props = {
    		type: "select",
    		name: "inputCampo",
    		id: "inputCampo",
    		$$slots: { default: [create_default_slot_15$1] },
    		$$scope: { ctx }
    	};

    	if (/*campo2*/ ctx[5] !== void 0) {
    		input2_props.value = /*campo2*/ ctx[5];
    	}

    	const input2 = new Input({ props: input2_props, $$inline: true });
    	binding_callbacks.push(() => bind(input2, "value", input2_value_binding));

    	function input3_value_binding(value) {
    		/*input3_value_binding*/ ctx[21].call(null, value);
    	}

    	let input3_props = {
    		type: "text",
    		name: "inputValor",
    		id: "inputValor"
    	};

    	if (/*valor2*/ ctx[6] !== void 0) {
    		input3_props.value = /*valor2*/ ctx[6];
    	}

    	const input3 = new Input({ props: input3_props, $$inline: true });
    	binding_callbacks.push(() => bind(input3, "value", input3_value_binding));

    	const block = {
    		c: function create() {
    			table = element("table");
    			tr0 = element("tr");
    			td0 = element("td");
    			label0 = element("label");
    			label0.textContent = "Buscar por:";
    			t1 = space();
    			create_component(input0.$$.fragment);
    			t2 = space();
    			td1 = element("td");
    			label1 = element("label");
    			label1.textContent = "Valor:";
    			t4 = space();
    			create_component(input1.$$.fragment);
    			t5 = space();
    			tr1 = element("tr");
    			td2 = element("td");
    			label2 = element("label");
    			label2.textContent = "Buscar por:";
    			t7 = space();
    			create_component(input2.$$.fragment);
    			t8 = space();
    			td3 = element("td");
    			label3 = element("label");
    			label3.textContent = "Valor:";
    			t10 = space();
    			create_component(input3.$$.fragment);
    			add_location(label0, file$c, 174, 6, 5332);
    			add_location(td0, file$c, 173, 5, 5320);
    			add_location(label1, file$c, 185, 6, 5799);
    			add_location(td1, file$c, 184, 5, 5787);
    			add_location(tr0, file$c, 172, 4, 5309);
    			add_location(label2, file$c, 192, 6, 5971);
    			add_location(td2, file$c, 191, 5, 5959);
    			add_location(label3, file$c, 203, 6, 6438);
    			add_location(td3, file$c, 202, 5, 6426);
    			add_location(tr1, file$c, 190, 4, 5948);
    			add_location(table, file$c, 171, 3, 5296);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, table, anchor);
    			append_dev(table, tr0);
    			append_dev(tr0, td0);
    			append_dev(td0, label0);
    			append_dev(td0, t1);
    			mount_component(input0, td0, null);
    			append_dev(tr0, t2);
    			append_dev(tr0, td1);
    			append_dev(td1, label1);
    			append_dev(td1, t4);
    			mount_component(input1, td1, null);
    			append_dev(table, t5);
    			append_dev(table, tr1);
    			append_dev(tr1, td2);
    			append_dev(td2, label2);
    			append_dev(td2, t7);
    			mount_component(input2, td2, null);
    			append_dev(tr1, t8);
    			append_dev(tr1, td3);
    			append_dev(td3, label3);
    			append_dev(td3, t10);
    			mount_component(input3, td3, null);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const input0_changes = {};

    			if (dirty[1] & /*$$scope*/ 8) {
    				input0_changes.$$scope = { dirty, ctx };
    			}

    			if (!updating_value && dirty[0] & /*campo1*/ 8) {
    				updating_value = true;
    				input0_changes.value = /*campo1*/ ctx[3];
    				add_flush_callback(() => updating_value = false);
    			}

    			input0.$set(input0_changes);
    			const input1_changes = {};

    			if (!updating_value_1 && dirty[0] & /*valor1*/ 16) {
    				updating_value_1 = true;
    				input1_changes.value = /*valor1*/ ctx[4];
    				add_flush_callback(() => updating_value_1 = false);
    			}

    			input1.$set(input1_changes);
    			const input2_changes = {};

    			if (dirty[1] & /*$$scope*/ 8) {
    				input2_changes.$$scope = { dirty, ctx };
    			}

    			if (!updating_value_2 && dirty[0] & /*campo2*/ 32) {
    				updating_value_2 = true;
    				input2_changes.value = /*campo2*/ ctx[5];
    				add_flush_callback(() => updating_value_2 = false);
    			}

    			input2.$set(input2_changes);
    			const input3_changes = {};

    			if (!updating_value_3 && dirty[0] & /*valor2*/ 64) {
    				updating_value_3 = true;
    				input3_changes.value = /*valor2*/ ctx[6];
    				add_flush_callback(() => updating_value_3 = false);
    			}

    			input3.$set(input3_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(input0.$$.fragment, local);
    			transition_in(input1.$$.fragment, local);
    			transition_in(input2.$$.fragment, local);
    			transition_in(input3.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(input0.$$.fragment, local);
    			transition_out(input1.$$.fragment, local);
    			transition_out(input2.$$.fragment, local);
    			transition_out(input3.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(table);
    			destroy_component(input0);
    			destroy_component(input1);
    			destroy_component(input2);
    			destroy_component(input3);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_14$1.name,
    		type: "slot",
    		source: "(171:2) <FormGroup>",
    		ctx
    	});

    	return block;
    }

    // (213:2) <Button style="margin-bottom:3%;" color="primary" on:click="{busqueda(campo1, valor1,campo2, valor2)}" class="button-search" >
    function create_default_slot_13$1(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Buscar");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_13$1.name,
    		type: "slot",
    		source: "(213:2) <Button style=\\\"margin-bottom:3%;\\\" color=\\\"primary\\\" on:click=\\\"{busqueda(campo1, valor1,campo2, valor2)}\\\" class=\\\"button-search\\\" >",
    		ctx
    	});

    	return block;
    }

    // (239:28) <Button outline color="danger" on:click="{deleteTourism(tou.province,tou.year)}">
    function create_default_slot_12$1(ctx) {
    	let i;
    	let t;

    	const block = {
    		c: function create() {
    			i = element("i");
    			t = text(" Eliminar");
    			attr_dev(i, "class", "fa fa-trash");
    			attr_dev(i, "aria-hidden", "true");
    			add_location(i, file$c, 238, 109, 7601);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, i, anchor);
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(i);
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_12$1.name,
    		type: "slot",
    		source: "(239:28) <Button outline color=\\\"danger\\\" on:click=\\\"{deleteTourism(tou.province,tou.year)}\\\">",
    		ctx
    	});

    	return block;
    }

    // (230:16) {#each tourism as tou}
    function create_each_block$1(ctx) {
    	let tr;
    	let td0;
    	let a;
    	let t0_value = /*tou*/ ctx[31].province + "";
    	let t0;
    	let a_href_value;
    	let t1;
    	let td1;
    	let t2_value = /*tou*/ ctx[31].year + "";
    	let t2;
    	let t3;
    	let td2;
    	let t4_value = /*tou*/ ctx[31].traveller + "";
    	let t4;
    	let t5;
    	let td3;
    	let t6_value = /*tou*/ ctx[31].overnightstay + "";
    	let t6;
    	let t7;
    	let td4;
    	let t8_value = /*tou*/ ctx[31].averagestay + "";
    	let t8;
    	let t9;
    	let td5;
    	let t10;
    	let current;

    	const button = new Button({
    			props: {
    				outline: true,
    				color: "danger",
    				$$slots: { default: [create_default_slot_12$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	button.$on("click", function () {
    		if (is_function(/*deleteTourism*/ ctx[11](/*tou*/ ctx[31].province, /*tou*/ ctx[31].year))) /*deleteTourism*/ ctx[11](/*tou*/ ctx[31].province, /*tou*/ ctx[31].year).apply(this, arguments);
    	});

    	const block = {
    		c: function create() {
    			tr = element("tr");
    			td0 = element("td");
    			a = element("a");
    			t0 = text(t0_value);
    			t1 = space();
    			td1 = element("td");
    			t2 = text(t2_value);
    			t3 = space();
    			td2 = element("td");
    			t4 = text(t4_value);
    			t5 = space();
    			td3 = element("td");
    			t6 = text(t6_value);
    			t7 = space();
    			td4 = element("td");
    			t8 = text(t8_value);
    			t9 = space();
    			td5 = element("td");
    			create_component(button.$$.fragment);
    			t10 = space();
    			attr_dev(a, "href", a_href_value = "#/rural-tourism-stats/" + /*tou*/ ctx[31].province + "/" + /*tou*/ ctx[31].year);
    			add_location(a, file$c, 232, 25, 7218);
    			add_location(td0, file$c, 231, 6, 7187);
    			add_location(td1, file$c, 234, 24, 7333);
    			add_location(td2, file$c, 235, 24, 7378);
    			add_location(td3, file$c, 236, 6, 7410);
    			add_location(td4, file$c, 237, 24, 7464);
    			add_location(td5, file$c, 238, 24, 7516);
    			add_location(tr, file$c, 230, 20, 7175);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, tr, anchor);
    			append_dev(tr, td0);
    			append_dev(td0, a);
    			append_dev(a, t0);
    			append_dev(tr, t1);
    			append_dev(tr, td1);
    			append_dev(td1, t2);
    			append_dev(tr, t3);
    			append_dev(tr, td2);
    			append_dev(td2, t4);
    			append_dev(tr, t5);
    			append_dev(tr, td3);
    			append_dev(td3, t6);
    			append_dev(tr, t7);
    			append_dev(tr, td4);
    			append_dev(td4, t8);
    			append_dev(tr, t9);
    			append_dev(tr, td5);
    			mount_component(button, td5, null);
    			append_dev(tr, t10);
    			current = true;
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			if ((!current || dirty[0] & /*tourism*/ 256) && t0_value !== (t0_value = /*tou*/ ctx[31].province + "")) set_data_dev(t0, t0_value);

    			if (!current || dirty[0] & /*tourism*/ 256 && a_href_value !== (a_href_value = "#/rural-tourism-stats/" + /*tou*/ ctx[31].province + "/" + /*tou*/ ctx[31].year)) {
    				attr_dev(a, "href", a_href_value);
    			}

    			if ((!current || dirty[0] & /*tourism*/ 256) && t2_value !== (t2_value = /*tou*/ ctx[31].year + "")) set_data_dev(t2, t2_value);
    			if ((!current || dirty[0] & /*tourism*/ 256) && t4_value !== (t4_value = /*tou*/ ctx[31].traveller + "")) set_data_dev(t4, t4_value);
    			if ((!current || dirty[0] & /*tourism*/ 256) && t6_value !== (t6_value = /*tou*/ ctx[31].overnightstay + "")) set_data_dev(t6, t6_value);
    			if ((!current || dirty[0] & /*tourism*/ 256) && t8_value !== (t8_value = /*tou*/ ctx[31].averagestay + "")) set_data_dev(t8, t8_value);
    			const button_changes = {};

    			if (dirty[1] & /*$$scope*/ 8) {
    				button_changes.$$scope = { dirty, ctx };
    			}

    			button.$set(button_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(button.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(button.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(tr);
    			destroy_component(button);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$1.name,
    		type: "each",
    		source: "(230:16) {#each tourism as tou}",
    		ctx
    	});

    	return block;
    }

    // (218:8) <Table bordered>
    function create_default_slot_11$1(ctx) {
    	let thead;
    	let tr;
    	let th0;
    	let t1;
    	let th1;
    	let t3;
    	let th2;
    	let t5;
    	let th3;
    	let t7;
    	let th4;
    	let t9;
    	let th5;
    	let t11;
    	let tbody;
    	let current;
    	let each_value = /*tourism*/ ctx[8];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$1(get_each_context$1(ctx, each_value, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	const block = {
    		c: function create() {
    			thead = element("thead");
    			tr = element("tr");
    			th0 = element("th");
    			th0.textContent = "Provincia";
    			t1 = space();
    			th1 = element("th");
    			th1.textContent = "Año";
    			t3 = space();
    			th2 = element("th");
    			th2.textContent = "Viajero";
    			t5 = space();
    			th3 = element("th");
    			th3.textContent = "Pernoctación";
    			t7 = space();
    			th4 = element("th");
    			th4.textContent = "Estancia media";
    			t9 = space();
    			th5 = element("th");
    			th5.textContent = "Acciones";
    			t11 = space();
    			tbody = element("tbody");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			add_location(th0, file$c, 220, 20, 6869);
    			add_location(th1, file$c, 221, 17, 6906);
    			add_location(th2, file$c, 222, 17, 6937);
    			add_location(th3, file$c, 223, 17, 6972);
    			add_location(th4, file$c, 224, 5, 7000);
    			add_location(th5, file$c, 225, 5, 7030);
    			add_location(tr, file$c, 219, 16, 6843);
    			add_location(thead, file$c, 218, 12, 6818);
    			add_location(tbody, file$c, 228, 12, 7106);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, thead, anchor);
    			append_dev(thead, tr);
    			append_dev(tr, th0);
    			append_dev(tr, t1);
    			append_dev(tr, th1);
    			append_dev(tr, t3);
    			append_dev(tr, th2);
    			append_dev(tr, t5);
    			append_dev(tr, th3);
    			append_dev(tr, t7);
    			append_dev(tr, th4);
    			append_dev(tr, t9);
    			append_dev(tr, th5);
    			insert_dev(target, t11, anchor);
    			insert_dev(target, tbody, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(tbody, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*deleteTourism, tourism*/ 2304) {
    				each_value = /*tourism*/ ctx[8];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$1(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block$1(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(tbody, null);
    					}
    				}

    				group_outros();

    				for (i = each_value.length; i < each_blocks.length; i += 1) {
    					out(i);
    				}

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			each_blocks = each_blocks.filter(Boolean);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(thead);
    			if (detaching) detach_dev(t11);
    			if (detaching) detach_dev(tbody);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_11$1.name,
    		type: "slot",
    		source: "(218:8) <Table bordered>",
    		ctx
    	});

    	return block;
    }

    // (252:33) <Button color="primary" on:click={insertTourism}>
    function create_default_slot_10$1(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Añadir");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_10$1.name,
    		type: "slot",
    		source: "(252:33) <Button color=\\\"primary\\\" on:click={insertTourism}>",
    		ctx
    	});

    	return block;
    }

    // (245:2) <Table style="background-color:#EAEEF0;">
    function create_default_slot_9$1(ctx) {
    	let tr;
    	let td0;
    	let strong0;
    	let t1;
    	let input0;
    	let t2;
    	let td1;
    	let strong1;
    	let t4;
    	let input1;
    	let t5;
    	let td2;
    	let strong2;
    	let t7;
    	let input2;
    	let t8;
    	let td3;
    	let strong3;
    	let t10;
    	let input3;
    	let t11;
    	let td4;
    	let strong4;
    	let t13;
    	let input4;
    	let t14;
    	let td5;
    	let strong5;
    	let t16;
    	let current;
    	let dispose;

    	const button = new Button({
    			props: {
    				color: "primary",
    				$$slots: { default: [create_default_slot_10$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	button.$on("click", /*insertTourism*/ ctx[10]);

    	const block = {
    		c: function create() {
    			tr = element("tr");
    			td0 = element("td");
    			strong0 = element("strong");
    			strong0.textContent = "Provincia:";
    			t1 = space();
    			input0 = element("input");
    			t2 = space();
    			td1 = element("td");
    			strong1 = element("strong");
    			strong1.textContent = "Año:";
    			t4 = space();
    			input1 = element("input");
    			t5 = space();
    			td2 = element("td");
    			strong2 = element("strong");
    			strong2.textContent = "Viajero:";
    			t7 = space();
    			input2 = element("input");
    			t8 = space();
    			td3 = element("td");
    			strong3 = element("strong");
    			strong3.textContent = "Pernoctación:";
    			t10 = space();
    			input3 = element("input");
    			t11 = space();
    			td4 = element("td");
    			strong4 = element("strong");
    			strong4.textContent = "Estancia media:";
    			t13 = space();
    			input4 = element("input");
    			t14 = space();
    			td5 = element("td");
    			strong5 = element("strong");
    			strong5.textContent = "Acción:";
    			t16 = space();
    			create_component(button.$$.fragment);
    			add_location(strong0, file$c, 246, 8, 7857);
    			add_location(input0, file$c, 246, 36, 7885);
    			add_location(td0, file$c, 246, 4, 7853);
    			add_location(strong1, file$c, 247, 8, 7942);
    			attr_dev(input1, "type", "number");
    			add_location(input1, file$c, 247, 30, 7964);
    			add_location(td1, file$c, 247, 4, 7938);
    			add_location(strong2, file$c, 248, 8, 8031);
    			attr_dev(input2, "type", "number");
    			add_location(input2, file$c, 248, 34, 8057);
    			add_location(td2, file$c, 248, 4, 8027);
    			add_location(strong3, file$c, 249, 8, 8129);
    			attr_dev(input3, "type", "number");
    			add_location(input3, file$c, 249, 39, 8160);
    			add_location(td3, file$c, 249, 4, 8125);
    			add_location(strong4, file$c, 250, 8, 8236);
    			attr_dev(input4, "type", "number");
    			add_location(input4, file$c, 250, 41, 8269);
    			add_location(td4, file$c, 250, 4, 8232);
    			add_location(strong5, file$c, 251, 8, 8343);
    			add_location(td5, file$c, 251, 4, 8339);
    			add_location(tr, file$c, 245, 3, 7843);
    		},
    		m: function mount(target, anchor, remount) {
    			insert_dev(target, tr, anchor);
    			append_dev(tr, td0);
    			append_dev(td0, strong0);
    			append_dev(td0, t1);
    			append_dev(td0, input0);
    			set_input_value(input0, /*newTourism*/ ctx[0].province);
    			append_dev(tr, t2);
    			append_dev(tr, td1);
    			append_dev(td1, strong1);
    			append_dev(td1, t4);
    			append_dev(td1, input1);
    			set_input_value(input1, /*newTourism*/ ctx[0].year);
    			append_dev(tr, t5);
    			append_dev(tr, td2);
    			append_dev(td2, strong2);
    			append_dev(td2, t7);
    			append_dev(td2, input2);
    			set_input_value(input2, /*newTourism*/ ctx[0].traveller);
    			append_dev(tr, t8);
    			append_dev(tr, td3);
    			append_dev(td3, strong3);
    			append_dev(td3, t10);
    			append_dev(td3, input3);
    			set_input_value(input3, /*newTourism*/ ctx[0].overnightstay);
    			append_dev(tr, t11);
    			append_dev(tr, td4);
    			append_dev(td4, strong4);
    			append_dev(td4, t13);
    			append_dev(td4, input4);
    			set_input_value(input4, /*newTourism*/ ctx[0].averagestay);
    			append_dev(tr, t14);
    			append_dev(tr, td5);
    			append_dev(td5, strong5);
    			append_dev(td5, t16);
    			mount_component(button, td5, null);
    			current = true;
    			if (remount) run_all(dispose);

    			dispose = [
    				listen_dev(input0, "input", /*input0_input_handler*/ ctx[22]),
    				listen_dev(input1, "input", /*input1_input_handler*/ ctx[23]),
    				listen_dev(input2, "input", /*input2_input_handler*/ ctx[24]),
    				listen_dev(input3, "input", /*input3_input_handler*/ ctx[25]),
    				listen_dev(input4, "input", /*input4_input_handler*/ ctx[26])
    			];
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*newTourism*/ 1 && input0.value !== /*newTourism*/ ctx[0].province) {
    				set_input_value(input0, /*newTourism*/ ctx[0].province);
    			}

    			if (dirty[0] & /*newTourism*/ 1 && to_number(input1.value) !== /*newTourism*/ ctx[0].year) {
    				set_input_value(input1, /*newTourism*/ ctx[0].year);
    			}

    			if (dirty[0] & /*newTourism*/ 1 && to_number(input2.value) !== /*newTourism*/ ctx[0].traveller) {
    				set_input_value(input2, /*newTourism*/ ctx[0].traveller);
    			}

    			if (dirty[0] & /*newTourism*/ 1 && to_number(input3.value) !== /*newTourism*/ ctx[0].overnightstay) {
    				set_input_value(input3, /*newTourism*/ ctx[0].overnightstay);
    			}

    			if (dirty[0] & /*newTourism*/ 1 && to_number(input4.value) !== /*newTourism*/ ctx[0].averagestay) {
    				set_input_value(input4, /*newTourism*/ ctx[0].averagestay);
    			}

    			const button_changes = {};

    			if (dirty[1] & /*$$scope*/ 8) {
    				button_changes.$$scope = { dirty, ctx };
    			}

    			button.$set(button_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(button.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(button.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(tr);
    			destroy_component(button);
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_9$1.name,
    		type: "slot",
    		source: "(245:2) <Table style=\\\"background-color:#EAEEF0;\\\">",
    		ctx
    	});

    	return block;
    }

    // (166:20)           Loading datas...      {:then tourism}
    function create_pending_block$2(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Loading datas...");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_pending_block$2.name,
    		type: "pending",
    		source: "(166:20)           Loading datas...      {:then tourism}",
    		ctx
    	});

    	return block;
    }

    // (257:1) {#if exitoMsg}
    function create_if_block_2$3(ctx) {
    	let p;
    	let t;

    	const block = {
    		c: function create() {
    			p = element("p");
    			t = text(/*exitoMsg*/ ctx[7]);
    			set_style(p, "color", "green");
    			add_location(p, file$c, 257, 8, 8504);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, p, anchor);
    			append_dev(p, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*exitoMsg*/ 128) set_data_dev(t, /*exitoMsg*/ ctx[7]);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(p);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2$3.name,
    		type: "if",
    		source: "(257:1) {#if exitoMsg}",
    		ctx
    	});

    	return block;
    }

    // (263:2) <PaginationItem class="{currentPage === 1 ? 'disabled' : ''}">
    function create_default_slot_8$1(ctx) {
    	let current;

    	const paginationlink = new PaginationLink({
    			props: {
    				previous: true,
    				href: "#/rural-tourism-stats"
    			},
    			$$inline: true
    		});

    	paginationlink.$on("click", /*click_handler*/ ctx[27]);

    	const block = {
    		c: function create() {
    			create_component(paginationlink.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(paginationlink, target, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(paginationlink.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(paginationlink.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(paginationlink, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_8$1.name,
    		type: "slot",
    		source: "(263:2) <PaginationItem class=\\\"{currentPage === 1 ? 'disabled' : ''}\\\">",
    		ctx
    	});

    	return block;
    }

    // (268:2) {#if currentPage != 1}
    function create_if_block_1$4(ctx) {
    	let current;

    	const paginationitem = new PaginationItem({
    			props: {
    				$$slots: { default: [create_default_slot_6$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(paginationitem.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(paginationitem, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const paginationitem_changes = {};

    			if (dirty[0] & /*currentPage*/ 2 | dirty[1] & /*$$scope*/ 8) {
    				paginationitem_changes.$$scope = { dirty, ctx };
    			}

    			paginationitem.$set(paginationitem_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(paginationitem.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(paginationitem.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(paginationitem, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$4.name,
    		type: "if",
    		source: "(268:2) {#if currentPage != 1}",
    		ctx
    	});

    	return block;
    }

    // (270:3) <PaginationLink href="#/rural-tourism-stats" on:click="{() => incrementOffset(-1)}" >
    function create_default_slot_7$1(ctx) {
    	let t_value = /*currentPage*/ ctx[1] - 1 + "";
    	let t;

    	const block = {
    		c: function create() {
    			t = text(t_value);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*currentPage*/ 2 && t_value !== (t_value = /*currentPage*/ ctx[1] - 1 + "")) set_data_dev(t, t_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_7$1.name,
    		type: "slot",
    		source: "(270:3) <PaginationLink href=\\\"#/rural-tourism-stats\\\" on:click=\\\"{() => incrementOffset(-1)}\\\" >",
    		ctx
    	});

    	return block;
    }

    // (269:2) <PaginationItem>
    function create_default_slot_6$1(ctx) {
    	let current;

    	const paginationlink = new PaginationLink({
    			props: {
    				href: "#/rural-tourism-stats",
    				$$slots: { default: [create_default_slot_7$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	paginationlink.$on("click", /*click_handler_1*/ ctx[28]);

    	const block = {
    		c: function create() {
    			create_component(paginationlink.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(paginationlink, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const paginationlink_changes = {};

    			if (dirty[0] & /*currentPage*/ 2 | dirty[1] & /*$$scope*/ 8) {
    				paginationlink_changes.$$scope = { dirty, ctx };
    			}

    			paginationlink.$set(paginationlink_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(paginationlink.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(paginationlink.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(paginationlink, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_6$1.name,
    		type: "slot",
    		source: "(269:2) <PaginationItem>",
    		ctx
    	});

    	return block;
    }

    // (274:3) <PaginationLink href="#/rural-tourism-stats" >
    function create_default_slot_5$1(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text(/*currentPage*/ ctx[1]);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*currentPage*/ 2) set_data_dev(t, /*currentPage*/ ctx[1]);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_5$1.name,
    		type: "slot",
    		source: "(274:3) <PaginationLink href=\\\"#/rural-tourism-stats\\\" >",
    		ctx
    	});

    	return block;
    }

    // (273:2) <PaginationItem active>
    function create_default_slot_4$1(ctx) {
    	let current;

    	const paginationlink = new PaginationLink({
    			props: {
    				href: "#/rural-tourism-stats",
    				$$slots: { default: [create_default_slot_5$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(paginationlink.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(paginationlink, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const paginationlink_changes = {};

    			if (dirty[0] & /*currentPage*/ 2 | dirty[1] & /*$$scope*/ 8) {
    				paginationlink_changes.$$scope = { dirty, ctx };
    			}

    			paginationlink.$set(paginationlink_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(paginationlink.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(paginationlink.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(paginationlink, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_4$1.name,
    		type: "slot",
    		source: "(273:2) <PaginationItem active>",
    		ctx
    	});

    	return block;
    }

    // (278:2) {#if moreData}
    function create_if_block$8(ctx) {
    	let current;

    	const paginationitem = new PaginationItem({
    			props: {
    				$$slots: { default: [create_default_slot_2$2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(paginationitem.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(paginationitem, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const paginationitem_changes = {};

    			if (dirty[0] & /*currentPage*/ 2 | dirty[1] & /*$$scope*/ 8) {
    				paginationitem_changes.$$scope = { dirty, ctx };
    			}

    			paginationitem.$set(paginationitem_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(paginationitem.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(paginationitem.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(paginationitem, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$8.name,
    		type: "if",
    		source: "(278:2) {#if moreData}",
    		ctx
    	});

    	return block;
    }

    // (280:3) <PaginationLink href="#/rural-tourism-stats" on:click="{() => incrementOffset(1)}">
    function create_default_slot_3$1(ctx) {
    	let t_value = /*currentPage*/ ctx[1] + 1 + "";
    	let t;

    	const block = {
    		c: function create() {
    			t = text(t_value);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*currentPage*/ 2 && t_value !== (t_value = /*currentPage*/ ctx[1] + 1 + "")) set_data_dev(t, t_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_3$1.name,
    		type: "slot",
    		source: "(280:3) <PaginationLink href=\\\"#/rural-tourism-stats\\\" on:click=\\\"{() => incrementOffset(1)}\\\">",
    		ctx
    	});

    	return block;
    }

    // (279:2) <PaginationItem >
    function create_default_slot_2$2(ctx) {
    	let current;

    	const paginationlink = new PaginationLink({
    			props: {
    				href: "#/rural-tourism-stats",
    				$$slots: { default: [create_default_slot_3$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	paginationlink.$on("click", /*click_handler_2*/ ctx[29]);

    	const block = {
    		c: function create() {
    			create_component(paginationlink.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(paginationlink, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const paginationlink_changes = {};

    			if (dirty[0] & /*currentPage*/ 2 | dirty[1] & /*$$scope*/ 8) {
    				paginationlink_changes.$$scope = { dirty, ctx };
    			}

    			paginationlink.$set(paginationlink_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(paginationlink.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(paginationlink.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(paginationlink, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_2$2.name,
    		type: "slot",
    		source: "(279:2) <PaginationItem >",
    		ctx
    	});

    	return block;
    }

    // (284:2) <PaginationItem class="{moreData ? '' : 'disabled'}">
    function create_default_slot_1$2(ctx) {
    	let current;

    	const paginationlink = new PaginationLink({
    			props: {
    				next: true,
    				href: "#/rural-tourism-stats"
    			},
    			$$inline: true
    		});

    	paginationlink.$on("click", /*click_handler_3*/ ctx[30]);

    	const block = {
    		c: function create() {
    			create_component(paginationlink.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(paginationlink, target, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(paginationlink.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(paginationlink.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(paginationlink, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1$2.name,
    		type: "slot",
    		source: "(284:2) <PaginationItem class=\\\"{moreData ? '' : 'disabled'}\\\">",
    		ctx
    	});

    	return block;
    }

    // (260:2) <Pagination ariaLabel="Cambiar de página">
    function create_default_slot$2(ctx) {
    	let t0;
    	let t1;
    	let t2;
    	let t3;
    	let current;

    	const paginationitem0 = new PaginationItem({
    			props: {
    				class: /*currentPage*/ ctx[1] === 1 ? "disabled" : "",
    				$$slots: { default: [create_default_slot_8$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	let if_block0 = /*currentPage*/ ctx[1] != 1 && create_if_block_1$4(ctx);

    	const paginationitem1 = new PaginationItem({
    			props: {
    				active: true,
    				$$slots: { default: [create_default_slot_4$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	let if_block1 = /*moreData*/ ctx[2] && create_if_block$8(ctx);

    	const paginationitem2 = new PaginationItem({
    			props: {
    				class: /*moreData*/ ctx[2] ? "" : "disabled",
    				$$slots: { default: [create_default_slot_1$2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(paginationitem0.$$.fragment);
    			t0 = space();
    			if (if_block0) if_block0.c();
    			t1 = space();
    			create_component(paginationitem1.$$.fragment);
    			t2 = space();
    			if (if_block1) if_block1.c();
    			t3 = space();
    			create_component(paginationitem2.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(paginationitem0, target, anchor);
    			insert_dev(target, t0, anchor);
    			if (if_block0) if_block0.m(target, anchor);
    			insert_dev(target, t1, anchor);
    			mount_component(paginationitem1, target, anchor);
    			insert_dev(target, t2, anchor);
    			if (if_block1) if_block1.m(target, anchor);
    			insert_dev(target, t3, anchor);
    			mount_component(paginationitem2, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const paginationitem0_changes = {};
    			if (dirty[0] & /*currentPage*/ 2) paginationitem0_changes.class = /*currentPage*/ ctx[1] === 1 ? "disabled" : "";

    			if (dirty[1] & /*$$scope*/ 8) {
    				paginationitem0_changes.$$scope = { dirty, ctx };
    			}

    			paginationitem0.$set(paginationitem0_changes);

    			if (/*currentPage*/ ctx[1] != 1) {
    				if (if_block0) {
    					if_block0.p(ctx, dirty);

    					if (dirty[0] & /*currentPage*/ 2) {
    						transition_in(if_block0, 1);
    					}
    				} else {
    					if_block0 = create_if_block_1$4(ctx);
    					if_block0.c();
    					transition_in(if_block0, 1);
    					if_block0.m(t1.parentNode, t1);
    				}
    			} else if (if_block0) {
    				group_outros();

    				transition_out(if_block0, 1, 1, () => {
    					if_block0 = null;
    				});

    				check_outros();
    			}

    			const paginationitem1_changes = {};

    			if (dirty[0] & /*currentPage*/ 2 | dirty[1] & /*$$scope*/ 8) {
    				paginationitem1_changes.$$scope = { dirty, ctx };
    			}

    			paginationitem1.$set(paginationitem1_changes);

    			if (/*moreData*/ ctx[2]) {
    				if (if_block1) {
    					if_block1.p(ctx, dirty);

    					if (dirty[0] & /*moreData*/ 4) {
    						transition_in(if_block1, 1);
    					}
    				} else {
    					if_block1 = create_if_block$8(ctx);
    					if_block1.c();
    					transition_in(if_block1, 1);
    					if_block1.m(t3.parentNode, t3);
    				}
    			} else if (if_block1) {
    				group_outros();

    				transition_out(if_block1, 1, 1, () => {
    					if_block1 = null;
    				});

    				check_outros();
    			}

    			const paginationitem2_changes = {};
    			if (dirty[0] & /*moreData*/ 4) paginationitem2_changes.class = /*moreData*/ ctx[2] ? "" : "disabled";

    			if (dirty[1] & /*$$scope*/ 8) {
    				paginationitem2_changes.$$scope = { dirty, ctx };
    			}

    			paginationitem2.$set(paginationitem2_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(paginationitem0.$$.fragment, local);
    			transition_in(if_block0);
    			transition_in(paginationitem1.$$.fragment, local);
    			transition_in(if_block1);
    			transition_in(paginationitem2.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(paginationitem0.$$.fragment, local);
    			transition_out(if_block0);
    			transition_out(paginationitem1.$$.fragment, local);
    			transition_out(if_block1);
    			transition_out(paginationitem2.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(paginationitem0, detaching);
    			if (detaching) detach_dev(t0);
    			if (if_block0) if_block0.d(detaching);
    			if (detaching) detach_dev(t1);
    			destroy_component(paginationitem1, detaching);
    			if (detaching) detach_dev(t2);
    			if (if_block1) if_block1.d(detaching);
    			if (detaching) detach_dev(t3);
    			destroy_component(paginationitem2, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$2.name,
    		type: "slot",
    		source: "(260:2) <Pagination ariaLabel=\\\"Cambiar de página\\\">",
    		ctx
    	});

    	return block;
    }

    function create_fragment$f(ctx) {
    	let main;
    	let h2;
    	let i;
    	let t0;
    	let t1;
    	let div;
    	let t2;
    	let t3;
    	let promise;
    	let t4;
    	let t5;
    	let current;

    	const button0 = new Button({
    			props: {
    				outline: true,
    				color: "primary",
    				$$slots: { default: [create_default_slot_18$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	button0.$on("click", /*loadInitialData*/ ctx[13]);

    	const button1 = new Button({
    			props: {
    				outline: true,
    				color: "danger",
    				$$slots: { default: [create_default_slot_17$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	button1.$on("click", /*deleteAllTourism*/ ctx[12]);

    	let info = {
    		ctx,
    		current: null,
    		token: null,
    		pending: create_pending_block$2,
    		then: create_then_block$2,
    		catch: create_catch_block$2,
    		value: 8,
    		blocks: [,,,]
    	};

    	handle_promise(promise = /*tourism*/ ctx[8], info);
    	let if_block = /*exitoMsg*/ ctx[7] && create_if_block_2$3(ctx);

    	const pagination = new Pagination({
    			props: {
    				ariaLabel: "Cambiar de página",
    				$$slots: { default: [create_default_slot$2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			main = element("main");
    			h2 = element("h2");
    			i = element("i");
    			t0 = text(" Turismo Rural");
    			t1 = space();
    			div = element("div");
    			create_component(button0.$$.fragment);
    			t2 = space();
    			create_component(button1.$$.fragment);
    			t3 = space();
    			info.block.c();
    			t4 = space();
    			if (if_block) if_block.c();
    			t5 = space();
    			create_component(pagination.$$.fragment);
    			attr_dev(i, "class", "fas fa-suitcase");
    			add_location(i, file$c, 159, 34, 4835);
    			set_style(h2, "text-align", "center");
    			add_location(h2, file$c, 159, 1, 4802);
    			set_style(div, "text-align", "center");
    			set_style(div, "padding-bottom", "3%");
    			add_location(div, file$c, 160, 2, 4889);
    			add_location(main, file$c, 158, 0, 4793);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			append_dev(main, h2);
    			append_dev(h2, i);
    			append_dev(h2, t0);
    			append_dev(main, t1);
    			append_dev(main, div);
    			mount_component(button0, div, null);
    			append_dev(div, t2);
    			mount_component(button1, div, null);
    			append_dev(main, t3);
    			info.block.m(main, info.anchor = null);
    			info.mount = () => main;
    			info.anchor = t4;
    			append_dev(main, t4);
    			if (if_block) if_block.m(main, null);
    			append_dev(main, t5);
    			mount_component(pagination, main, null);
    			current = true;
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			const button0_changes = {};

    			if (dirty[1] & /*$$scope*/ 8) {
    				button0_changes.$$scope = { dirty, ctx };
    			}

    			button0.$set(button0_changes);
    			const button1_changes = {};

    			if (dirty[1] & /*$$scope*/ 8) {
    				button1_changes.$$scope = { dirty, ctx };
    			}

    			button1.$set(button1_changes);
    			info.ctx = ctx;

    			if (dirty[0] & /*tourism*/ 256 && promise !== (promise = /*tourism*/ ctx[8]) && handle_promise(promise, info)) ; else {
    				const child_ctx = ctx.slice();
    				child_ctx[8] = info.resolved;
    				info.block.p(child_ctx, dirty);
    			}

    			if (/*exitoMsg*/ ctx[7]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block_2$3(ctx);
    					if_block.c();
    					if_block.m(main, t5);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}

    			const pagination_changes = {};

    			if (dirty[0] & /*moreData, currentPage*/ 6 | dirty[1] & /*$$scope*/ 8) {
    				pagination_changes.$$scope = { dirty, ctx };
    			}

    			pagination.$set(pagination_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(button0.$$.fragment, local);
    			transition_in(button1.$$.fragment, local);
    			transition_in(info.block);
    			transition_in(pagination.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(button0.$$.fragment, local);
    			transition_out(button1.$$.fragment, local);

    			for (let i = 0; i < 3; i += 1) {
    				const block = info.blocks[i];
    				transition_out(block);
    			}

    			transition_out(pagination.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			destroy_component(button0);
    			destroy_component(button1);
    			info.block.d();
    			info.token = null;
    			info = null;
    			if (if_block) if_block.d();
    			destroy_component(pagination);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$f.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$f($$self, $$props, $$invalidate) {
    	let tourism = [];

    	let newTourism = {
    		province: "",
    		year: "",
    		traveller: "",
    		overnightstay: "",
    		averagestay: ""
    	};

    	//Variables para paginación
    	let numeroRecursos = 10;

    	let offset = 0;
    	let currentPage = 1;
    	let moreData = true;

    	//Variables para busqueda
    	let campo1 = "";

    	let valor1 = "";
    	let campo2 = "";
    	let valor2 = "";
    	onMount(getTourism);

    	async function getTourism() {
    		console.log("Fetching rural-tourism-stats...");
    		const res = await fetch("/api/v2/rural-tourism-stats?offset=" + numeroRecursos * offset + "&limit=" + numeroRecursos);
    		const resNext = await fetch("/api/v2/rural-tourism-stats?offset=" + numeroRecursos * (offset + 1) + "&limit=" + numeroRecursos);

    		if (res.ok && resNext.ok) {
    			console.log("Ok:");
    			const json = await res.json();
    			const jsonNext = await resNext.json();
    			$$invalidate(8, tourism = json);

    			if (jsonNext.length == 0) {
    				$$invalidate(2, moreData = false);
    			} else {
    				$$invalidate(2, moreData = true);
    			}

    			console.log("Received " + tourism.length + " rural-tourism-stats.");
    		} else {
    			console.log("ERROR!");
    		}
    	}

    	function incrementOffset(valor) {
    		offset += valor;
    		$$invalidate(1, currentPage += valor);
    		getTourism();
    	}

    	async function insertTourism() {
    		$$invalidate(7, exitoMsg = "");
    		console.log("Inserting new data..." + JSON.stringify(newTourism));

    		const res = await fetch("/api/v2/rural-tourism-stats", {
    			method: "POST",
    			body: JSON.stringify(newTourism),
    			headers: { "Content-Type": "application/json" }
    		}).then(function (res) {
    			getTourism();

    			if (res.ok) {
    				$$invalidate(0, newTourism = {
    					province: "",
    					year: "",
    					traveller: "",
    					overnightstay: "",
    					averagestay: ""
    				});

    				$$invalidate(7, exitoMsg = res.status + ": " + res.statusText + ". Dato insertado con éxito");
    			} else if (res.status == 400) {
    				window.alert("ERROR: Debe completar todos los campos");
    			} else if (res.status == 409) {
    				window.alert("ERROR: el dato " + newTourism.province + " " + newTourism.year + " ya existe.");
    			}
    		});
    	}

    	async function deleteTourism(province, year) {
    		const res = await fetch("/api/v2/rural-tourism-stats/" + province + "/" + year, { method: "DELETE" }).then(function (res) {
    			getTourism();
    			$$invalidate(7, exitoMsg = res.status + ": " + res.statusText + ". Dato eliminado con éxito");
    		});
    	}

    	async function deleteAllTourism() {
    		const res = await fetch("/api/v2/rural-tourism-stats/", { method: "DELETE" }).then(function (res) {
    			getTourism();
    			$$invalidate(7, exitoMsg = res.status + ": " + res.statusText + ". Datos eliminados con éxito");
    		});
    	}

    	async function loadInitialData() {
    		const res = await fetch("/api/v2/rural-tourism-stats/loadInitialData", { method: "GET" }).then(function (res) {
    			getTourism();
    			$$invalidate(7, exitoMsg = res.status + ": " + res.statusText + ". Datos reiniciados con éxito");
    		});
    	}

    	async function busqueda(campo1, valor1, campo2, valor2) {
    		offset = 0;
    		$$invalidate(1, currentPage = 1);
    		$$invalidate(2, moreData = false);
    		$$invalidate(7, exitoMsg = "");
    		console.log("Searching data: " + campo1 + ": " + valor1 + ", " + campo2 + ": " + valor2);
    		var url = "/api/v2/rural-tourism-stats";

    		if (campo1 != "" && campo2 != "" && valor1 != "" && valor2 != "") {
    			url = url + "?" + campo1 + "=" + valor1 + "&" + campo2 + "=" + valor2;
    		} else if (campo1 == "" && campo2 != "" && valor2 != "") {
    			url = url + "?" + campo2 + "=" + valor2;
    		} else if (campo1 != "" && campo2 == "" && valor1 != "") {
    			url = url + "?" + campo1 + "=" + valor1;
    		}

    		console.log(url);
    		const res = await fetch(url);

    		if (res.ok) {
    			console.log("Ok:");
    			const json = await res.json();
    			$$invalidate(8, tourism = json);
    			console.log("Found " + tourism.length + " rural-tourism-stats.");
    			$$invalidate(7, exitoMsg = res.status + ": " + res.statusText + ". Búsqueda realizada con éxito. " + tourism.length + " elementos encontrados.");
    		} else {
    			window.alert("ERROR: Compruebe que ha insertado valores correctos para la búsqueda");
    			console.log("ERROR!");
    		}
    	}

    	let exitoMsg = "";
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console_1$4.warn(`<TourismTable_svelte> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("TourismTable_svelte", $$slots, []);

    	function input0_value_binding(value) {
    		campo1 = value;
    		$$invalidate(3, campo1);
    	}

    	function input1_value_binding(value) {
    		valor1 = value;
    		$$invalidate(4, valor1);
    	}

    	function input2_value_binding(value) {
    		campo2 = value;
    		$$invalidate(5, campo2);
    	}

    	function input3_value_binding(value) {
    		valor2 = value;
    		$$invalidate(6, valor2);
    	}

    	function input0_input_handler() {
    		newTourism.province = this.value;
    		$$invalidate(0, newTourism);
    	}

    	function input1_input_handler() {
    		newTourism.year = to_number(this.value);
    		$$invalidate(0, newTourism);
    	}

    	function input2_input_handler() {
    		newTourism.traveller = to_number(this.value);
    		$$invalidate(0, newTourism);
    	}

    	function input3_input_handler() {
    		newTourism.overnightstay = to_number(this.value);
    		$$invalidate(0, newTourism);
    	}

    	function input4_input_handler() {
    		newTourism.averagestay = to_number(this.value);
    		$$invalidate(0, newTourism);
    	}

    	const click_handler = () => incrementOffset(-1);
    	const click_handler_1 = () => incrementOffset(-1);
    	const click_handler_2 = () => incrementOffset(1);
    	const click_handler_3 = () => incrementOffset(1);

    	$$self.$capture_state = () => ({
    		onMount,
    		Table,
    		Button,
    		Pagination,
    		PaginationItem,
    		PaginationLink,
    		Input,
    		FormGroup,
    		tourism,
    		newTourism,
    		numeroRecursos,
    		offset,
    		currentPage,
    		moreData,
    		campo1,
    		valor1,
    		campo2,
    		valor2,
    		getTourism,
    		incrementOffset,
    		insertTourism,
    		deleteTourism,
    		deleteAllTourism,
    		loadInitialData,
    		busqueda,
    		exitoMsg
    	});

    	$$self.$inject_state = $$props => {
    		if ("tourism" in $$props) $$invalidate(8, tourism = $$props.tourism);
    		if ("newTourism" in $$props) $$invalidate(0, newTourism = $$props.newTourism);
    		if ("numeroRecursos" in $$props) numeroRecursos = $$props.numeroRecursos;
    		if ("offset" in $$props) offset = $$props.offset;
    		if ("currentPage" in $$props) $$invalidate(1, currentPage = $$props.currentPage);
    		if ("moreData" in $$props) $$invalidate(2, moreData = $$props.moreData);
    		if ("campo1" in $$props) $$invalidate(3, campo1 = $$props.campo1);
    		if ("valor1" in $$props) $$invalidate(4, valor1 = $$props.valor1);
    		if ("campo2" in $$props) $$invalidate(5, campo2 = $$props.campo2);
    		if ("valor2" in $$props) $$invalidate(6, valor2 = $$props.valor2);
    		if ("exitoMsg" in $$props) $$invalidate(7, exitoMsg = $$props.exitoMsg);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		newTourism,
    		currentPage,
    		moreData,
    		campo1,
    		valor1,
    		campo2,
    		valor2,
    		exitoMsg,
    		tourism,
    		incrementOffset,
    		insertTourism,
    		deleteTourism,
    		deleteAllTourism,
    		loadInitialData,
    		busqueda,
    		offset,
    		numeroRecursos,
    		getTourism,
    		input0_value_binding,
    		input1_value_binding,
    		input2_value_binding,
    		input3_value_binding,
    		input0_input_handler,
    		input1_input_handler,
    		input2_input_handler,
    		input3_input_handler,
    		input4_input_handler,
    		click_handler,
    		click_handler_1,
    		click_handler_2,
    		click_handler_3
    	];
    }

    class TourismTable_svelte extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$f, create_fragment$f, safe_not_equal, {}, [-1, -1]);

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "TourismTable_svelte",
    			options,
    			id: create_fragment$f.name
    		});
    	}
    }

    /* src\front\tourismAPI\EditTourism.svelte.html generated by Svelte v3.21.0 */

    const { console: console_1$5 } = globals;
    const file$d = "src\\front\\tourismAPI\\EditTourism.svelte.html";

    // (1:0) <script>      import {          onMount      }
    function create_catch_block$3(ctx) {
    	const block = {
    		c: noop,
    		m: noop,
    		p: noop,
    		i: noop,
    		o: noop,
    		d: noop
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_catch_block$3.name,
    		type: "catch",
    		source: "(1:0) <script>      import {          onMount      }",
    		ctx
    	});

    	return block;
    }

    // (82:4) {:then tourism}
    function create_then_block$3(ctx) {
    	let current;

    	const table = new Table({
    			props: {
    				bordered: true,
    				$$slots: { default: [create_default_slot_1$3] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(table.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(table, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const table_changes = {};

    			if (dirty & /*$$scope, updatedAveragestay, updatedOvernightstay, updatedTraveller, updatedYear, updatedProvince*/ 8254) {
    				table_changes.$$scope = { dirty, ctx };
    			}

    			table.$set(table_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(table.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(table.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(table, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_then_block$3.name,
    		type: "then",
    		source: "(82:4) {:then tourism}",
    		ctx
    	});

    	return block;
    }

    // (101:25) <Button outline  color="success" on:click={updateTourism}>
    function create_default_slot_2$3(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Actualizar");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_2$3.name,
    		type: "slot",
    		source: "(101:25) <Button outline  color=\\\"success\\\" on:click={updateTourism}>",
    		ctx
    	});

    	return block;
    }

    // (83:8) <Table bordered>
    function create_default_slot_1$3(ctx) {
    	let thead;
    	let tr0;
    	let th0;
    	let t1;
    	let th1;
    	let t3;
    	let th2;
    	let t5;
    	let th3;
    	let t7;
    	let th4;
    	let t9;
    	let th5;
    	let t11;
    	let tbody;
    	let tr1;
    	let td0;
    	let t12;
    	let t13;
    	let td1;
    	let t14;
    	let t15;
    	let td2;
    	let input0;
    	let t16;
    	let td3;
    	let input1;
    	let t17;
    	let td4;
    	let input2;
    	let t18;
    	let td5;
    	let current;
    	let dispose;

    	const button = new Button({
    			props: {
    				outline: true,
    				color: "success",
    				$$slots: { default: [create_default_slot_2$3] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	button.$on("click", /*updateTourism*/ ctx[8]);

    	const block = {
    		c: function create() {
    			thead = element("thead");
    			tr0 = element("tr");
    			th0 = element("th");
    			th0.textContent = "Provincia";
    			t1 = space();
    			th1 = element("th");
    			th1.textContent = "Año";
    			t3 = space();
    			th2 = element("th");
    			th2.textContent = "Viajero";
    			t5 = space();
    			th3 = element("th");
    			th3.textContent = "Pernoctación";
    			t7 = space();
    			th4 = element("th");
    			th4.textContent = "Estancia media";
    			t9 = space();
    			th5 = element("th");
    			th5.textContent = "Acción";
    			t11 = space();
    			tbody = element("tbody");
    			tr1 = element("tr");
    			td0 = element("td");
    			t12 = text(/*updatedProvince*/ ctx[1]);
    			t13 = space();
    			td1 = element("td");
    			t14 = text(/*updatedYear*/ ctx[2]);
    			t15 = space();
    			td2 = element("td");
    			input0 = element("input");
    			t16 = space();
    			td3 = element("td");
    			input1 = element("input");
    			t17 = space();
    			td4 = element("td");
    			input2 = element("input");
    			t18 = space();
    			td5 = element("td");
    			create_component(button.$$.fragment);
    			add_location(th0, file$d, 85, 19, 2574);
    			add_location(th1, file$d, 86, 17, 2611);
    			add_location(th2, file$d, 87, 17, 2642);
    			add_location(th3, file$d, 88, 17, 2677);
    			add_location(th4, file$d, 89, 5, 2705);
    			add_location(th5, file$d, 90, 5, 2735);
    			add_location(tr0, file$d, 84, 16, 2549);
    			add_location(thead, file$d, 83, 12, 2524);
    			add_location(td0, file$d, 95, 20, 2860);
    			add_location(td1, file$d, 96, 5, 2893);
    			attr_dev(input0, "type", "number");
    			add_location(input0, file$d, 97, 24, 2941);
    			add_location(td2, file$d, 97, 20, 2937);
    			attr_dev(input1, "type", "number");
    			add_location(input1, file$d, 98, 24, 3025);
    			add_location(td3, file$d, 98, 20, 3021);
    			attr_dev(input2, "type", "number");
    			add_location(input2, file$d, 99, 9, 3098);
    			add_location(td4, file$d, 99, 5, 3094);
    			add_location(td5, file$d, 100, 20, 3180);
    			add_location(tr1, file$d, 94, 16, 2834);
    			add_location(tbody, file$d, 93, 12, 2809);
    		},
    		m: function mount(target, anchor, remount) {
    			insert_dev(target, thead, anchor);
    			append_dev(thead, tr0);
    			append_dev(tr0, th0);
    			append_dev(tr0, t1);
    			append_dev(tr0, th1);
    			append_dev(tr0, t3);
    			append_dev(tr0, th2);
    			append_dev(tr0, t5);
    			append_dev(tr0, th3);
    			append_dev(tr0, t7);
    			append_dev(tr0, th4);
    			append_dev(tr0, t9);
    			append_dev(tr0, th5);
    			insert_dev(target, t11, anchor);
    			insert_dev(target, tbody, anchor);
    			append_dev(tbody, tr1);
    			append_dev(tr1, td0);
    			append_dev(td0, t12);
    			append_dev(tr1, t13);
    			append_dev(tr1, td1);
    			append_dev(td1, t14);
    			append_dev(tr1, t15);
    			append_dev(tr1, td2);
    			append_dev(td2, input0);
    			set_input_value(input0, /*updatedTraveller*/ ctx[3]);
    			append_dev(tr1, t16);
    			append_dev(tr1, td3);
    			append_dev(td3, input1);
    			set_input_value(input1, /*updatedOvernightstay*/ ctx[4]);
    			append_dev(tr1, t17);
    			append_dev(tr1, td4);
    			append_dev(td4, input2);
    			set_input_value(input2, /*updatedAveragestay*/ ctx[5]);
    			append_dev(tr1, t18);
    			append_dev(tr1, td5);
    			mount_component(button, td5, null);
    			current = true;
    			if (remount) run_all(dispose);

    			dispose = [
    				listen_dev(input0, "input", /*input0_input_handler*/ ctx[10]),
    				listen_dev(input1, "input", /*input1_input_handler*/ ctx[11]),
    				listen_dev(input2, "input", /*input2_input_handler*/ ctx[12])
    			];
    		},
    		p: function update(ctx, dirty) {
    			if (!current || dirty & /*updatedProvince*/ 2) set_data_dev(t12, /*updatedProvince*/ ctx[1]);
    			if (!current || dirty & /*updatedYear*/ 4) set_data_dev(t14, /*updatedYear*/ ctx[2]);

    			if (dirty & /*updatedTraveller*/ 8 && to_number(input0.value) !== /*updatedTraveller*/ ctx[3]) {
    				set_input_value(input0, /*updatedTraveller*/ ctx[3]);
    			}

    			if (dirty & /*updatedOvernightstay*/ 16 && to_number(input1.value) !== /*updatedOvernightstay*/ ctx[4]) {
    				set_input_value(input1, /*updatedOvernightstay*/ ctx[4]);
    			}

    			if (dirty & /*updatedAveragestay*/ 32 && to_number(input2.value) !== /*updatedAveragestay*/ ctx[5]) {
    				set_input_value(input2, /*updatedAveragestay*/ ctx[5]);
    			}

    			const button_changes = {};

    			if (dirty & /*$$scope*/ 8192) {
    				button_changes.$$scope = { dirty, ctx };
    			}

    			button.$set(button_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(button.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(button.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(thead);
    			if (detaching) detach_dev(t11);
    			if (detaching) detach_dev(tbody);
    			destroy_component(button);
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1$3.name,
    		type: "slot",
    		source: "(83:8) <Table bordered>",
    		ctx
    	});

    	return block;
    }

    // (80:20)           Loading datas...      {:then tourism}
    function create_pending_block$3(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Loading datas...");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_pending_block$3.name,
    		type: "pending",
    		source: "(80:20)           Loading datas...      {:then tourism}",
    		ctx
    	});

    	return block;
    }

    // (106:4) {#if exitoMsg}
    function create_if_block$9(ctx) {
    	let p;
    	let t;

    	const block = {
    		c: function create() {
    			p = element("p");
    			t = text(/*exitoMsg*/ ctx[6]);
    			set_style(p, "color", "green");
    			add_location(p, file$d, 106, 8, 3370);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, p, anchor);
    			append_dev(p, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*exitoMsg*/ 64) set_data_dev(t, /*exitoMsg*/ ctx[6]);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(p);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$9.name,
    		type: "if",
    		source: "(106:4) {#if exitoMsg}",
    		ctx
    	});

    	return block;
    }

    // (109:4) <Button outline color="secondary" on:click="{pop}">
    function create_default_slot$3(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Volver");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$3.name,
    		type: "slot",
    		source: "(109:4) <Button outline color=\\\"secondary\\\" on:click=\\\"{pop}\\\">",
    		ctx
    	});

    	return block;
    }

    function create_fragment$g(ctx) {
    	let main;
    	let h3;
    	let t0;
    	let strong;
    	let t1_value = /*params*/ ctx[0].tourismProvince + "";
    	let t1;
    	let t2;
    	let t3_value = /*params*/ ctx[0].tourismYear + "";
    	let t3;
    	let t4;
    	let promise;
    	let t5;
    	let t6;
    	let current;

    	let info = {
    		ctx,
    		current: null,
    		token: null,
    		pending: create_pending_block$3,
    		then: create_then_block$3,
    		catch: create_catch_block$3,
    		value: 7,
    		blocks: [,,,]
    	};

    	handle_promise(promise = /*tourism*/ ctx[7], info);
    	let if_block = /*exitoMsg*/ ctx[6] && create_if_block$9(ctx);

    	const button = new Button({
    			props: {
    				outline: true,
    				color: "secondary",
    				$$slots: { default: [create_default_slot$3] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	button.$on("click", pop);

    	const block = {
    		c: function create() {
    			main = element("main");
    			h3 = element("h3");
    			t0 = text("Editar el dato: ");
    			strong = element("strong");
    			t1 = text(t1_value);
    			t2 = space();
    			t3 = text(t3_value);
    			t4 = space();
    			info.block.c();
    			t5 = space();
    			if (if_block) if_block.c();
    			t6 = space();
    			create_component(button.$$.fragment);
    			add_location(strong, file$d, 78, 24, 2348);
    			add_location(h3, file$d, 78, 4, 2328);
    			add_location(main, file$d, 77, 0, 2316);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			append_dev(main, h3);
    			append_dev(h3, t0);
    			append_dev(h3, strong);
    			append_dev(strong, t1);
    			append_dev(strong, t2);
    			append_dev(strong, t3);
    			append_dev(main, t4);
    			info.block.m(main, info.anchor = null);
    			info.mount = () => main;
    			info.anchor = t5;
    			append_dev(main, t5);
    			if (if_block) if_block.m(main, null);
    			append_dev(main, t6);
    			mount_component(button, main, null);
    			current = true;
    		},
    		p: function update(new_ctx, [dirty]) {
    			ctx = new_ctx;
    			if ((!current || dirty & /*params*/ 1) && t1_value !== (t1_value = /*params*/ ctx[0].tourismProvince + "")) set_data_dev(t1, t1_value);
    			if ((!current || dirty & /*params*/ 1) && t3_value !== (t3_value = /*params*/ ctx[0].tourismYear + "")) set_data_dev(t3, t3_value);
    			info.ctx = ctx;

    			if (dirty & /*tourism*/ 128 && promise !== (promise = /*tourism*/ ctx[7]) && handle_promise(promise, info)) ; else {
    				const child_ctx = ctx.slice();
    				child_ctx[7] = info.resolved;
    				info.block.p(child_ctx, dirty);
    			}

    			if (/*exitoMsg*/ ctx[6]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block$9(ctx);
    					if_block.c();
    					if_block.m(main, t6);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}

    			const button_changes = {};

    			if (dirty & /*$$scope*/ 8192) {
    				button_changes.$$scope = { dirty, ctx };
    			}

    			button.$set(button_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(info.block);
    			transition_in(button.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			for (let i = 0; i < 3; i += 1) {
    				const block = info.blocks[i];
    				transition_out(block);
    			}

    			transition_out(button.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			info.block.d();
    			info.token = null;
    			info = null;
    			if (if_block) if_block.d();
    			destroy_component(button);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$g.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$g($$self, $$props, $$invalidate) {
    	let { params = {} } = $$props;
    	let tourism = {};
    	let updatedProvince = "";
    	let updatedYear = 0;
    	let updatedTraveller = 0;
    	let updatedOvernightstay = 0;
    	let updatedAveragestay = 0;
    	let exitoMsg = "";
    	onMount(getTourism);

    	async function getTourism() {
    		console.log("Fetching tourism...");
    		const res = await fetch("/api/v2/rural-tourism-stats/" + params.tourismProvince + "/" + params.tourismYear);

    		if (res.ok) {
    			console.log("Ok:");
    			const json = await res.json();
    			$$invalidate(7, tourism = json);
    			$$invalidate(1, updatedProvince = params.tourismProvince);
    			$$invalidate(2, updatedYear = parseInt(params.tourismYear));
    			$$invalidate(3, updatedTraveller = tourism.traveller);
    			$$invalidate(4, updatedOvernightstay = tourism.overnightstay);
    			$$invalidate(5, updatedAveragestay = tourism.averagestay);
    			console.log("Received tourism.");
    		} else if (res.status == 404) {
    			window.alert("El dato: " + params.tourismProvince + " " + params.tourismYear + " no existe");
    		}
    	}

    	async function updateTourism() {
    		$$invalidate(6, exitoMsg = "");
    		console.log("Updating tourism..." + JSON.stringify(params.tourismProvince));

    		const res = await fetch("/api/v2/rural-tourism-stats/" + params.tourismProvince + "/" + params.tourismYear, {
    			method: "PUT",
    			body: JSON.stringify({
    				province: params.tourismProvince,
    				year: parseInt(params.tourismYear),
    				traveller: updatedTraveller,
    				overnightstay: updatedOvernightstay,
    				averagestay: updatedAveragestay
    			}),
    			headers: { "Content-Type": "application/json" }
    		}).then(function (res) {
    			getTourism();

    			if (res.ok) {
    				$$invalidate(6, exitoMsg = res.status + ": " + res.statusText + ". Dato actualizado con éxito");
    				console.log("OK!" + exitoMsg);
    			} else if (res.status == 400) {
    				window.alert("Los datos que se intentan insertar no son válidos");
    			}
    		});
    	}

    	const writable_props = ["params"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console_1$5.warn(`<EditTourism_svelte> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("EditTourism_svelte", $$slots, []);

    	function input0_input_handler() {
    		updatedTraveller = to_number(this.value);
    		$$invalidate(3, updatedTraveller);
    	}

    	function input1_input_handler() {
    		updatedOvernightstay = to_number(this.value);
    		$$invalidate(4, updatedOvernightstay);
    	}

    	function input2_input_handler() {
    		updatedAveragestay = to_number(this.value);
    		$$invalidate(5, updatedAveragestay);
    	}

    	$$self.$set = $$props => {
    		if ("params" in $$props) $$invalidate(0, params = $$props.params);
    	};

    	$$self.$capture_state = () => ({
    		onMount,
    		pop,
    		Table,
    		Button,
    		params,
    		tourism,
    		updatedProvince,
    		updatedYear,
    		updatedTraveller,
    		updatedOvernightstay,
    		updatedAveragestay,
    		exitoMsg,
    		getTourism,
    		updateTourism
    	});

    	$$self.$inject_state = $$props => {
    		if ("params" in $$props) $$invalidate(0, params = $$props.params);
    		if ("tourism" in $$props) $$invalidate(7, tourism = $$props.tourism);
    		if ("updatedProvince" in $$props) $$invalidate(1, updatedProvince = $$props.updatedProvince);
    		if ("updatedYear" in $$props) $$invalidate(2, updatedYear = $$props.updatedYear);
    		if ("updatedTraveller" in $$props) $$invalidate(3, updatedTraveller = $$props.updatedTraveller);
    		if ("updatedOvernightstay" in $$props) $$invalidate(4, updatedOvernightstay = $$props.updatedOvernightstay);
    		if ("updatedAveragestay" in $$props) $$invalidate(5, updatedAveragestay = $$props.updatedAveragestay);
    		if ("exitoMsg" in $$props) $$invalidate(6, exitoMsg = $$props.exitoMsg);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		params,
    		updatedProvince,
    		updatedYear,
    		updatedTraveller,
    		updatedOvernightstay,
    		updatedAveragestay,
    		exitoMsg,
    		tourism,
    		updateTourism,
    		getTourism,
    		input0_input_handler,
    		input1_input_handler,
    		input2_input_handler
    	];
    }

    class EditTourism_svelte extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$g, create_fragment$g, safe_not_equal, { params: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "EditTourism_svelte",
    			options,
    			id: create_fragment$g.name
    		});
    	}

    	get params() {
    		throw new Error("<EditTourism_svelte>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set params(value) {
    		throw new Error("<EditTourism_svelte>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\front\accidentsAPI\AccidentsTrafficsTable.svelte generated by Svelte v3.21.0 */

    const { console: console_1$6 } = globals;
    const file$e = "src\\front\\accidentsAPI\\AccidentsTrafficsTable.svelte";

    function get_each_context$2(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[39] = list[i];
    	return child_ctx;
    }

    // (217:4) <Button outline color="secondary" on:click="{pop}">
    function create_default_slot_20(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Volver");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_20.name,
    		type: "slot",
    		source: "(217:4) <Button outline color=\\\"secondary\\\" on:click=\\\"{pop}\\\">",
    		ctx
    	});

    	return block;
    }

    // (219:4) {#if successMsg}
    function create_if_block_3$2(ctx) {
    	let p;
    	let t;

    	const block = {
    		c: function create() {
    			p = element("p");
    			t = text(/*success*/ ctx[8]);
    			set_style(p, "color", "green");
    			add_location(p, file$e, 219, 8, 7662);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, p, anchor);
    			append_dev(p, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*success*/ 256) set_data_dev(t, /*success*/ ctx[8]);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(p);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_3$2.name,
    		type: "if",
    		source: "(219:4) {#if successMsg}",
    		ctx
    	});

    	return block;
    }

    // (1:0) <script>      import {          onMount      }
    function create_catch_block$4(ctx) {
    	const block = {
    		c: noop,
    		m: noop,
    		p: noop,
    		i: noop,
    		o: noop,
    		d: noop
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_catch_block$4.name,
    		type: "catch",
    		source: "(1:0) <script>      import {          onMount      }",
    		ctx
    	});

    	return block;
    }

    // (225:4) {:then trafficAccidents}
    function create_then_block$4(ctx) {
    	let t0;
    	let t1;
    	let t2;
    	let current;

    	const formgroup = new FormGroup({
    			props: {
    				$$slots: { default: [create_default_slot_14$2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const table = new Table({
    			props: {
    				bordered: true,
    				$$slots: { default: [create_default_slot_11$2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const button0 = new Button({
    			props: {
    				outline: true,
    				color: "primary",
    				style: "float: left;",
    				$$slots: { default: [create_default_slot_10$2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	button0.$on("click", /*loadInitialData*/ ctx[14]);

    	const button1 = new Button({
    			props: {
    				outline: true,
    				color: "danger",
    				style: "float: right;",
    				$$slots: { default: [create_default_slot_9$2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	button1.$on("click", /*deleteAllAccidents*/ ctx[13]);

    	const block = {
    		c: function create() {
    			create_component(formgroup.$$.fragment);
    			t0 = space();
    			create_component(table.$$.fragment);
    			t1 = space();
    			create_component(button0.$$.fragment);
    			t2 = space();
    			create_component(button1.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(formgroup, target, anchor);
    			insert_dev(target, t0, anchor);
    			mount_component(table, target, anchor);
    			insert_dev(target, t1, anchor);
    			mount_component(button0, target, anchor);
    			insert_dev(target, t2, anchor);
    			mount_component(button1, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const formgroup_changes = {};

    			if (dirty[0] & /*buscar, valores, buscar2, valores2, combinada*/ 632 | dirty[1] & /*$$scope*/ 2048) {
    				formgroup_changes.$$scope = { dirty, ctx };
    			}

    			formgroup.$set(formgroup_changes);
    			const table_changes = {};

    			if (dirty[0] & /*trafficAccidents, newTrafficAccident*/ 1025 | dirty[1] & /*$$scope*/ 2048) {
    				table_changes.$$scope = { dirty, ctx };
    			}

    			table.$set(table_changes);
    			const button0_changes = {};

    			if (dirty[1] & /*$$scope*/ 2048) {
    				button0_changes.$$scope = { dirty, ctx };
    			}

    			button0.$set(button0_changes);
    			const button1_changes = {};

    			if (dirty[1] & /*$$scope*/ 2048) {
    				button1_changes.$$scope = { dirty, ctx };
    			}

    			button1.$set(button1_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(formgroup.$$.fragment, local);
    			transition_in(table.$$.fragment, local);
    			transition_in(button0.$$.fragment, local);
    			transition_in(button1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(formgroup.$$.fragment, local);
    			transition_out(table.$$.fragment, local);
    			transition_out(button0.$$.fragment, local);
    			transition_out(button1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(formgroup, detaching);
    			if (detaching) detach_dev(t0);
    			destroy_component(table, detaching);
    			if (detaching) detach_dev(t1);
    			destroy_component(button0, detaching);
    			if (detaching) detach_dev(t2);
    			destroy_component(button1, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_then_block$4.name,
    		type: "then",
    		source: "(225:4) {:then trafficAccidents}",
    		ctx
    	});

    	return block;
    }

    // (275:12) {:else}
    function create_else_block$6(ctx) {
    	let table;
    	let thead;
    	let tr0;
    	let th0;
    	let label0;
    	let t1;
    	let th1;
    	let label1;
    	let t3;
    	let th2;
    	let t4;
    	let tbody;
    	let tr1;
    	let td0;
    	let updating_value;
    	let t5;
    	let td1;
    	let updating_value_1;
    	let t6;
    	let td2;
    	let current;

    	function input0_value_binding_1(value) {
    		/*input0_value_binding_1*/ ctx[28].call(null, value);
    	}

    	let input0_props = {
    		type: "select",
    		name: "busqueda",
    		id: "busqueda",
    		$$slots: { default: [create_default_slot_19$1] },
    		$$scope: { ctx }
    	};

    	if (/*buscar*/ ctx[3] !== void 0) {
    		input0_props.value = /*buscar*/ ctx[3];
    	}

    	const input0 = new Input({ props: input0_props, $$inline: true });
    	binding_callbacks.push(() => bind(input0, "value", input0_value_binding_1));

    	function input1_value_binding_1(value) {
    		/*input1_value_binding_1*/ ctx[29].call(null, value);
    	}

    	let input1_props = { type: "text", name: "valor", id: "valor" };

    	if (/*valores*/ ctx[4] !== void 0) {
    		input1_props.value = /*valores*/ ctx[4];
    	}

    	const input1 = new Input({ props: input1_props, $$inline: true });
    	binding_callbacks.push(() => bind(input1, "value", input1_value_binding_1));

    	const button = new Button({
    			props: {
    				color: "primary",
    				class: "button-search",
    				$$slots: { default: [create_default_slot_18$2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	button.$on("click", function () {
    		if (is_function(/*findObject*/ ctx[15](/*buscar*/ ctx[3], /*valores*/ ctx[4]))) /*findObject*/ ctx[15](/*buscar*/ ctx[3], /*valores*/ ctx[4]).apply(this, arguments);
    	});

    	const block = {
    		c: function create() {
    			table = element("table");
    			thead = element("thead");
    			tr0 = element("tr");
    			th0 = element("th");
    			label0 = element("label");
    			label0.textContent = "Buscar por:";
    			t1 = space();
    			th1 = element("th");
    			label1 = element("label");
    			label1.textContent = "Valor:";
    			t3 = space();
    			th2 = element("th");
    			t4 = space();
    			tbody = element("tbody");
    			tr1 = element("tr");
    			td0 = element("td");
    			create_component(input0.$$.fragment);
    			t5 = space();
    			td1 = element("td");
    			create_component(input1.$$.fragment);
    			t6 = space();
    			td2 = element("td");
    			create_component(button.$$.fragment);
    			add_location(label0, file$e, 278, 32, 10782);
    			add_location(th0, file$e, 278, 28, 10778);
    			add_location(label1, file$e, 279, 32, 10847);
    			add_location(th1, file$e, 279, 28, 10843);
    			add_location(th2, file$e, 280, 28, 10903);
    			add_location(tr0, file$e, 277, 24, 10744);
    			add_location(thead, file$e, 276, 20, 10711);
    			set_style(td0, "width", "25%");
    			add_location(td0, file$e, 285, 28, 11062);
    			set_style(td1, "width", "25%");
    			add_location(td1, file$e, 295, 28, 11789);
    			set_style(td2, "width", "25%");
    			add_location(td2, file$e, 298, 28, 11986);
    			add_location(tr1, file$e, 284, 24, 11028);
    			add_location(tbody, file$e, 283, 20, 10995);
    			set_style(table, "width", "75%");
    			add_location(table, file$e, 275, 16, 10661);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, table, anchor);
    			append_dev(table, thead);
    			append_dev(thead, tr0);
    			append_dev(tr0, th0);
    			append_dev(th0, label0);
    			append_dev(tr0, t1);
    			append_dev(tr0, th1);
    			append_dev(th1, label1);
    			append_dev(tr0, t3);
    			append_dev(tr0, th2);
    			append_dev(table, t4);
    			append_dev(table, tbody);
    			append_dev(tbody, tr1);
    			append_dev(tr1, td0);
    			mount_component(input0, td0, null);
    			append_dev(tr1, t5);
    			append_dev(tr1, td1);
    			mount_component(input1, td1, null);
    			append_dev(tr1, t6);
    			append_dev(tr1, td2);
    			mount_component(button, td2, null);
    			current = true;
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			const input0_changes = {};

    			if (dirty[1] & /*$$scope*/ 2048) {
    				input0_changes.$$scope = { dirty, ctx };
    			}

    			if (!updating_value && dirty[0] & /*buscar*/ 8) {
    				updating_value = true;
    				input0_changes.value = /*buscar*/ ctx[3];
    				add_flush_callback(() => updating_value = false);
    			}

    			input0.$set(input0_changes);
    			const input1_changes = {};

    			if (!updating_value_1 && dirty[0] & /*valores*/ 16) {
    				updating_value_1 = true;
    				input1_changes.value = /*valores*/ ctx[4];
    				add_flush_callback(() => updating_value_1 = false);
    			}

    			input1.$set(input1_changes);
    			const button_changes = {};

    			if (dirty[1] & /*$$scope*/ 2048) {
    				button_changes.$$scope = { dirty, ctx };
    			}

    			button.$set(button_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(input0.$$.fragment, local);
    			transition_in(input1.$$.fragment, local);
    			transition_in(button.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(input0.$$.fragment, local);
    			transition_out(input1.$$.fragment, local);
    			transition_out(button.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(table);
    			destroy_component(input0);
    			destroy_component(input1);
    			destroy_component(button);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$6.name,
    		type: "else",
    		source: "(275:12) {:else}",
    		ctx
    	});

    	return block;
    }

    // (229:12) {#if combinada}
    function create_if_block_2$4(ctx) {
    	let table;
    	let thead;
    	let tr0;
    	let th0;
    	let label0;
    	let t1;
    	let th1;
    	let label1;
    	let t3;
    	let th2;
    	let label2;
    	let t5;
    	let th3;
    	let label3;
    	let t7;
    	let tbody;
    	let tr1;
    	let td0;
    	let updating_value;
    	let t8;
    	let td1;
    	let updating_value_1;
    	let t9;
    	let td2;
    	let updating_value_2;
    	let t10;
    	let td3;
    	let updating_value_3;
    	let t11;
    	let tr2;
    	let td4;
    	let current;

    	function input0_value_binding(value) {
    		/*input0_value_binding*/ ctx[24].call(null, value);
    	}

    	let input0_props = {
    		type: "select",
    		name: "busqueda",
    		id: "busqueda",
    		$$slots: { default: [create_default_slot_17$2] },
    		$$scope: { ctx }
    	};

    	if (/*buscar*/ ctx[3] !== void 0) {
    		input0_props.value = /*buscar*/ ctx[3];
    	}

    	const input0 = new Input({ props: input0_props, $$inline: true });
    	binding_callbacks.push(() => bind(input0, "value", input0_value_binding));

    	function input1_value_binding(value) {
    		/*input1_value_binding*/ ctx[25].call(null, value);
    	}

    	let input1_props = { type: "text", name: "valor", id: "valor" };

    	if (/*valores*/ ctx[4] !== void 0) {
    		input1_props.value = /*valores*/ ctx[4];
    	}

    	const input1 = new Input({ props: input1_props, $$inline: true });
    	binding_callbacks.push(() => bind(input1, "value", input1_value_binding));

    	function input2_value_binding(value) {
    		/*input2_value_binding*/ ctx[26].call(null, value);
    	}

    	let input2_props = {
    		type: "select",
    		name: "busqueda2",
    		id: "busqueda2",
    		$$slots: { default: [create_default_slot_16$2] },
    		$$scope: { ctx }
    	};

    	if (/*buscar2*/ ctx[5] !== void 0) {
    		input2_props.value = /*buscar2*/ ctx[5];
    	}

    	const input2 = new Input({ props: input2_props, $$inline: true });
    	binding_callbacks.push(() => bind(input2, "value", input2_value_binding));

    	function input3_value_binding(value) {
    		/*input3_value_binding*/ ctx[27].call(null, value);
    	}

    	let input3_props = {
    		type: "text",
    		name: "valor2",
    		id: "valor2"
    	};

    	if (/*valores2*/ ctx[6] !== void 0) {
    		input3_props.value = /*valores2*/ ctx[6];
    	}

    	const input3 = new Input({ props: input3_props, $$inline: true });
    	binding_callbacks.push(() => bind(input3, "value", input3_value_binding));

    	const button = new Button({
    			props: {
    				color: "primary",
    				class: "button-search",
    				$$slots: { default: [create_default_slot_15$2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	button.$on("click", function () {
    		if (is_function(/*findObject2*/ ctx[16](/*buscar*/ ctx[3], /*valores*/ ctx[4], /*buscar2*/ ctx[5], /*valores2*/ ctx[6]))) /*findObject2*/ ctx[16](/*buscar*/ ctx[3], /*valores*/ ctx[4], /*buscar2*/ ctx[5], /*valores2*/ ctx[6]).apply(this, arguments);
    	});

    	const block = {
    		c: function create() {
    			table = element("table");
    			thead = element("thead");
    			tr0 = element("tr");
    			th0 = element("th");
    			label0 = element("label");
    			label0.textContent = "Buscar por:";
    			t1 = space();
    			th1 = element("th");
    			label1 = element("label");
    			label1.textContent = "Valor:";
    			t3 = space();
    			th2 = element("th");
    			label2 = element("label");
    			label2.textContent = "Buscar por:";
    			t5 = space();
    			th3 = element("th");
    			label3 = element("label");
    			label3.textContent = "Valor:";
    			t7 = space();
    			tbody = element("tbody");
    			tr1 = element("tr");
    			td0 = element("td");
    			create_component(input0.$$.fragment);
    			t8 = space();
    			td1 = element("td");
    			create_component(input1.$$.fragment);
    			t9 = space();
    			td2 = element("td");
    			create_component(input2.$$.fragment);
    			t10 = space();
    			td3 = element("td");
    			create_component(input3.$$.fragment);
    			t11 = space();
    			tr2 = element("tr");
    			td4 = element("td");
    			create_component(button.$$.fragment);
    			add_location(label0, file$e, 232, 32, 8119);
    			add_location(th0, file$e, 232, 28, 8115);
    			add_location(label1, file$e, 233, 32, 8184);
    			add_location(th1, file$e, 233, 28, 8180);
    			add_location(label2, file$e, 234, 32, 8244);
    			add_location(th2, file$e, 234, 28, 8240);
    			add_location(label3, file$e, 235, 32, 8309);
    			add_location(th3, file$e, 235, 28, 8305);
    			add_location(tr0, file$e, 231, 24, 8081);
    			add_location(thead, file$e, 230, 20, 8048);
    			add_location(td0, file$e, 240, 28, 8485);
    			add_location(td1, file$e, 250, 28, 9192);
    			add_location(td2, file$e, 253, 28, 9369);
    			add_location(td3, file$e, 263, 28, 10079);
    			add_location(tr1, file$e, 239, 24, 8451);
    			set_style(td4, "width", "25%");
    			add_location(td4, file$e, 268, 28, 10320);
    			add_location(tr2, file$e, 267, 24, 10286);
    			add_location(tbody, file$e, 238, 20, 8418);
    			set_style(table, "width", "100%");
    			add_location(table, file$e, 229, 16, 7998);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, table, anchor);
    			append_dev(table, thead);
    			append_dev(thead, tr0);
    			append_dev(tr0, th0);
    			append_dev(th0, label0);
    			append_dev(tr0, t1);
    			append_dev(tr0, th1);
    			append_dev(th1, label1);
    			append_dev(tr0, t3);
    			append_dev(tr0, th2);
    			append_dev(th2, label2);
    			append_dev(tr0, t5);
    			append_dev(tr0, th3);
    			append_dev(th3, label3);
    			append_dev(table, t7);
    			append_dev(table, tbody);
    			append_dev(tbody, tr1);
    			append_dev(tr1, td0);
    			mount_component(input0, td0, null);
    			append_dev(tr1, t8);
    			append_dev(tr1, td1);
    			mount_component(input1, td1, null);
    			append_dev(tr1, t9);
    			append_dev(tr1, td2);
    			mount_component(input2, td2, null);
    			append_dev(tr1, t10);
    			append_dev(tr1, td3);
    			mount_component(input3, td3, null);
    			append_dev(tbody, t11);
    			append_dev(tbody, tr2);
    			append_dev(tr2, td4);
    			mount_component(button, td4, null);
    			current = true;
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			const input0_changes = {};

    			if (dirty[1] & /*$$scope*/ 2048) {
    				input0_changes.$$scope = { dirty, ctx };
    			}

    			if (!updating_value && dirty[0] & /*buscar*/ 8) {
    				updating_value = true;
    				input0_changes.value = /*buscar*/ ctx[3];
    				add_flush_callback(() => updating_value = false);
    			}

    			input0.$set(input0_changes);
    			const input1_changes = {};

    			if (!updating_value_1 && dirty[0] & /*valores*/ 16) {
    				updating_value_1 = true;
    				input1_changes.value = /*valores*/ ctx[4];
    				add_flush_callback(() => updating_value_1 = false);
    			}

    			input1.$set(input1_changes);
    			const input2_changes = {};

    			if (dirty[1] & /*$$scope*/ 2048) {
    				input2_changes.$$scope = { dirty, ctx };
    			}

    			if (!updating_value_2 && dirty[0] & /*buscar2*/ 32) {
    				updating_value_2 = true;
    				input2_changes.value = /*buscar2*/ ctx[5];
    				add_flush_callback(() => updating_value_2 = false);
    			}

    			input2.$set(input2_changes);
    			const input3_changes = {};

    			if (!updating_value_3 && dirty[0] & /*valores2*/ 64) {
    				updating_value_3 = true;
    				input3_changes.value = /*valores2*/ ctx[6];
    				add_flush_callback(() => updating_value_3 = false);
    			}

    			input3.$set(input3_changes);
    			const button_changes = {};

    			if (dirty[1] & /*$$scope*/ 2048) {
    				button_changes.$$scope = { dirty, ctx };
    			}

    			button.$set(button_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(input0.$$.fragment, local);
    			transition_in(input1.$$.fragment, local);
    			transition_in(input2.$$.fragment, local);
    			transition_in(input3.$$.fragment, local);
    			transition_in(button.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(input0.$$.fragment, local);
    			transition_out(input1.$$.fragment, local);
    			transition_out(input2.$$.fragment, local);
    			transition_out(input3.$$.fragment, local);
    			transition_out(button.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(table);
    			destroy_component(input0);
    			destroy_component(input1);
    			destroy_component(input2);
    			destroy_component(input3);
    			destroy_component(button);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2$4.name,
    		type: "if",
    		source: "(229:12) {#if combinada}",
    		ctx
    	});

    	return block;
    }

    // (287:32) <Input type="select" name="busqueda" id="busqueda" bind:value="{buscar}">
    function create_default_slot_19$1(ctx) {
    	let option0;
    	let t0;
    	let option1;
    	let t2;
    	let option2;
    	let t4;
    	let option3;
    	let t6;
    	let option4;
    	let t8;
    	let option5;

    	const block = {
    		c: function create() {
    			option0 = element("option");
    			t0 = space();
    			option1 = element("option");
    			option1.textContent = "Provincia";
    			t2 = space();
    			option2 = element("option");
    			option2.textContent = "Año";
    			t4 = space();
    			option3 = element("option");
    			option3.textContent = "Accidentes con víctimas";
    			t6 = space();
    			option4 = element("option");
    			option4.textContent = "Fallecidos";
    			t8 = space();
    			option5 = element("option");
    			option5.textContent = "Heridos";
    			option0.disabled = true;
    			option0.selected = true;
    			option0.__value = "";
    			option0.value = option0.__value;
    			add_location(option0, file$e, 287, 36, 11231);
    			option1.__value = "province";
    			option1.value = option1.__value;
    			add_location(option1, file$e, 288, 36, 11304);
    			option2.__value = "year";
    			option2.value = option2.__value;
    			add_location(option2, file$e, 289, 36, 11385);
    			option3.__value = "trafficaccidentvictim";
    			option3.value = option3.__value;
    			add_location(option3, file$e, 290, 36, 11456);
    			option4.__value = "dead";
    			option4.value = option4.__value;
    			add_location(option4, file$e, 291, 36, 11564);
    			option5.__value = "injured";
    			option5.value = option5.__value;
    			add_location(option5, file$e, 292, 36, 11642);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, option0, anchor);
    			insert_dev(target, t0, anchor);
    			insert_dev(target, option1, anchor);
    			insert_dev(target, t2, anchor);
    			insert_dev(target, option2, anchor);
    			insert_dev(target, t4, anchor);
    			insert_dev(target, option3, anchor);
    			insert_dev(target, t6, anchor);
    			insert_dev(target, option4, anchor);
    			insert_dev(target, t8, anchor);
    			insert_dev(target, option5, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(option0);
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(option1);
    			if (detaching) detach_dev(t2);
    			if (detaching) detach_dev(option2);
    			if (detaching) detach_dev(t4);
    			if (detaching) detach_dev(option3);
    			if (detaching) detach_dev(t6);
    			if (detaching) detach_dev(option4);
    			if (detaching) detach_dev(t8);
    			if (detaching) detach_dev(option5);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_19$1.name,
    		type: "slot",
    		source: "(287:32) <Input type=\\\"select\\\" name=\\\"busqueda\\\" id=\\\"busqueda\\\" bind:value=\\\"{buscar}\\\">",
    		ctx
    	});

    	return block;
    }

    // (300:32) <Button color="primary" on:click="{findObject(buscar, valores)}" class="button-search">
    function create_default_slot_18$2(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Buscar");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_18$2.name,
    		type: "slot",
    		source: "(300:32) <Button color=\\\"primary\\\" on:click=\\\"{findObject(buscar, valores)}\\\" class=\\\"button-search\\\">",
    		ctx
    	});

    	return block;
    }

    // (242:32) <Input type="select" name="busqueda" id="busqueda" bind:value="{buscar}">
    function create_default_slot_17$2(ctx) {
    	let option0;
    	let t0;
    	let option1;
    	let t2;
    	let option2;
    	let t4;
    	let option3;
    	let t6;
    	let option4;
    	let t8;
    	let option5;

    	const block = {
    		c: function create() {
    			option0 = element("option");
    			t0 = space();
    			option1 = element("option");
    			option1.textContent = "Provincia";
    			t2 = space();
    			option2 = element("option");
    			option2.textContent = "Año";
    			t4 = space();
    			option3 = element("option");
    			option3.textContent = "Accidentes con víctimas";
    			t6 = space();
    			option4 = element("option");
    			option4.textContent = "Fallecidos";
    			t8 = space();
    			option5 = element("option");
    			option5.textContent = "Heridos";
    			option0.disabled = true;
    			option0.selected = true;
    			option0.__value = "";
    			option0.value = option0.__value;
    			add_location(option0, file$e, 242, 36, 8634);
    			option1.__value = "province";
    			option1.value = option1.__value;
    			add_location(option1, file$e, 243, 36, 8707);
    			option2.__value = "year";
    			option2.value = option2.__value;
    			add_location(option2, file$e, 244, 36, 8788);
    			option3.__value = "trafficaccidentvictim";
    			option3.value = option3.__value;
    			add_location(option3, file$e, 245, 36, 8859);
    			option4.__value = "dead";
    			option4.value = option4.__value;
    			add_location(option4, file$e, 246, 36, 8967);
    			option5.__value = "injured";
    			option5.value = option5.__value;
    			add_location(option5, file$e, 247, 36, 9045);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, option0, anchor);
    			insert_dev(target, t0, anchor);
    			insert_dev(target, option1, anchor);
    			insert_dev(target, t2, anchor);
    			insert_dev(target, option2, anchor);
    			insert_dev(target, t4, anchor);
    			insert_dev(target, option3, anchor);
    			insert_dev(target, t6, anchor);
    			insert_dev(target, option4, anchor);
    			insert_dev(target, t8, anchor);
    			insert_dev(target, option5, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(option0);
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(option1);
    			if (detaching) detach_dev(t2);
    			if (detaching) detach_dev(option2);
    			if (detaching) detach_dev(t4);
    			if (detaching) detach_dev(option3);
    			if (detaching) detach_dev(t6);
    			if (detaching) detach_dev(option4);
    			if (detaching) detach_dev(t8);
    			if (detaching) detach_dev(option5);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_17$2.name,
    		type: "slot",
    		source: "(242:32) <Input type=\\\"select\\\" name=\\\"busqueda\\\" id=\\\"busqueda\\\" bind:value=\\\"{buscar}\\\">",
    		ctx
    	});

    	return block;
    }

    // (255:32) <Input type="select" name="busqueda2" id="busqueda2" bind:value="{buscar2}">
    function create_default_slot_16$2(ctx) {
    	let option0;
    	let t0;
    	let option1;
    	let t2;
    	let option2;
    	let t4;
    	let option3;
    	let t6;
    	let option4;
    	let t8;
    	let option5;

    	const block = {
    		c: function create() {
    			option0 = element("option");
    			t0 = space();
    			option1 = element("option");
    			option1.textContent = "Provincia";
    			t2 = space();
    			option2 = element("option");
    			option2.textContent = "Año";
    			t4 = space();
    			option3 = element("option");
    			option3.textContent = "Accidentes con víctimas";
    			t6 = space();
    			option4 = element("option");
    			option4.textContent = "Fallecidos";
    			t8 = space();
    			option5 = element("option");
    			option5.textContent = "Heridos";
    			option0.disabled = true;
    			option0.selected = true;
    			option0.__value = "";
    			option0.value = option0.__value;
    			add_location(option0, file$e, 255, 36, 9521);
    			option1.__value = "province";
    			option1.value = option1.__value;
    			add_location(option1, file$e, 256, 36, 9594);
    			option2.__value = "year";
    			option2.value = option2.__value;
    			add_location(option2, file$e, 257, 36, 9675);
    			option3.__value = "trafficaccidentvictim";
    			option3.value = option3.__value;
    			add_location(option3, file$e, 258, 36, 9746);
    			option4.__value = "dead";
    			option4.value = option4.__value;
    			add_location(option4, file$e, 259, 36, 9854);
    			option5.__value = "injured";
    			option5.value = option5.__value;
    			add_location(option5, file$e, 260, 36, 9932);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, option0, anchor);
    			insert_dev(target, t0, anchor);
    			insert_dev(target, option1, anchor);
    			insert_dev(target, t2, anchor);
    			insert_dev(target, option2, anchor);
    			insert_dev(target, t4, anchor);
    			insert_dev(target, option3, anchor);
    			insert_dev(target, t6, anchor);
    			insert_dev(target, option4, anchor);
    			insert_dev(target, t8, anchor);
    			insert_dev(target, option5, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(option0);
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(option1);
    			if (detaching) detach_dev(t2);
    			if (detaching) detach_dev(option2);
    			if (detaching) detach_dev(t4);
    			if (detaching) detach_dev(option3);
    			if (detaching) detach_dev(t6);
    			if (detaching) detach_dev(option4);
    			if (detaching) detach_dev(t8);
    			if (detaching) detach_dev(option5);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_16$2.name,
    		type: "slot",
    		source: "(255:32) <Input type=\\\"select\\\" name=\\\"busqueda2\\\" id=\\\"busqueda2\\\" bind:value=\\\"{buscar2}\\\">",
    		ctx
    	});

    	return block;
    }

    // (270:32) <Button color="primary" on:click="{findObject2(buscar, valores, buscar2, valores2)}" class="button-search">
    function create_default_slot_15$2(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Buscar");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_15$2.name,
    		type: "slot",
    		source: "(270:32) <Button color=\\\"primary\\\" on:click=\\\"{findObject2(buscar, valores, buscar2, valores2)}\\\" class=\\\"button-search\\\">",
    		ctx
    	});

    	return block;
    }

    // (227:8) <FormGroup>
    function create_default_slot_14$2(ctx) {
    	let br0;
    	let input;
    	let t0;
    	let strong;
    	let br1;
    	let t2;
    	let current_block_type_index;
    	let if_block;
    	let if_block_anchor;
    	let current;
    	let dispose;
    	const if_block_creators = [create_if_block_2$4, create_else_block$6];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*combinada*/ ctx[9]) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			br0 = element("br");
    			input = element("input");
    			t0 = space();
    			strong = element("strong");
    			strong.textContent = "Hacer búsqueda con 2 parámetros";
    			br1 = element("br");
    			t2 = space();
    			if_block.c();
    			if_block_anchor = empty();
    			add_location(br0, file$e, 227, 12, 7848);
    			attr_dev(input, "type", "checkbox");
    			add_location(input, file$e, 227, 16, 7852);
    			add_location(strong, file$e, 227, 63, 7899);
    			add_location(br1, file$e, 227, 111, 7947);
    		},
    		m: function mount(target, anchor, remount) {
    			insert_dev(target, br0, anchor);
    			insert_dev(target, input, anchor);
    			input.checked = /*combinada*/ ctx[9];
    			insert_dev(target, t0, anchor);
    			insert_dev(target, strong, anchor);
    			insert_dev(target, br1, anchor);
    			insert_dev(target, t2, anchor);
    			if_blocks[current_block_type_index].m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    			if (remount) dispose();
    			dispose = listen_dev(input, "change", /*input_change_handler*/ ctx[23]);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*combinada*/ 512) {
    				input.checked = /*combinada*/ ctx[9];
    			}

    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				}

    				transition_in(if_block, 1);
    				if_block.m(if_block_anchor.parentNode, if_block_anchor);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(br0);
    			if (detaching) detach_dev(input);
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(strong);
    			if (detaching) detach_dev(br1);
    			if (detaching) detach_dev(t2);
    			if_blocks[current_block_type_index].d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_14$2.name,
    		type: "slot",
    		source: "(227:8) <FormGroup>",
    		ctx
    	});

    	return block;
    }

    // (326:24) <Button outline color="primary" on:click={insertTrafficAccident}>
    function create_default_slot_13$2(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Insertar");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_13$2.name,
    		type: "slot",
    		source: "(326:24) <Button outline color=\\\"primary\\\" on:click={insertTrafficAccident}>",
    		ctx
    	});

    	return block;
    }

    // (335:28) <Button outline color="danger" on:click="{deleteAccident(trafficAccident.province, trafficAccident.year)}">
    function create_default_slot_12$2(ctx) {
    	let i;
    	let t;

    	const block = {
    		c: function create() {
    			i = element("i");
    			t = text(" Borrar");
    			attr_dev(i, "class", "fa fa-trash");
    			attr_dev(i, "aria-hidden", "true");
    			add_location(i, file$e, 334, 135, 13942);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, i, anchor);
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(i);
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_12$2.name,
    		type: "slot",
    		source: "(335:28) <Button outline color=\\\"danger\\\" on:click=\\\"{deleteAccident(trafficAccident.province, trafficAccident.year)}\\\">",
    		ctx
    	});

    	return block;
    }

    // (328:16) {#each trafficAccidents as trafficAccident}
    function create_each_block$2(ctx) {
    	let tr;
    	let td0;
    	let a;
    	let t0_value = /*trafficAccident*/ ctx[39].province + "";
    	let t0;
    	let a_href_value;
    	let t1;
    	let td1;
    	let t2_value = /*trafficAccident*/ ctx[39].year + "";
    	let t2;
    	let t3;
    	let td2;
    	let t4_value = /*trafficAccident*/ ctx[39].trafficaccidentvictim + "";
    	let t4;
    	let t5;
    	let td3;
    	let t6_value = /*trafficAccident*/ ctx[39].dead + "";
    	let t6;
    	let t7;
    	let td4;
    	let t8_value = /*trafficAccident*/ ctx[39].injured + "";
    	let t8;
    	let t9;
    	let td5;
    	let t10;
    	let current;

    	const button = new Button({
    			props: {
    				outline: true,
    				color: "danger",
    				$$slots: { default: [create_default_slot_12$2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	button.$on("click", function () {
    		if (is_function(/*deleteAccident*/ ctx[12](/*trafficAccident*/ ctx[39].province, /*trafficAccident*/ ctx[39].year))) /*deleteAccident*/ ctx[12](/*trafficAccident*/ ctx[39].province, /*trafficAccident*/ ctx[39].year).apply(this, arguments);
    	});

    	const block = {
    		c: function create() {
    			tr = element("tr");
    			td0 = element("td");
    			a = element("a");
    			t0 = text(t0_value);
    			t1 = space();
    			td1 = element("td");
    			t2 = text(t2_value);
    			t3 = space();
    			td2 = element("td");
    			t4 = text(t4_value);
    			t5 = space();
    			td3 = element("td");
    			t6 = text(t6_value);
    			t7 = space();
    			td4 = element("td");
    			t8 = text(t8_value);
    			t9 = space();
    			td5 = element("td");
    			create_component(button.$$.fragment);
    			t10 = space();
    			attr_dev(a, "href", a_href_value = "#/traffic-accidents/" + /*trafficAccident*/ ctx[39].province + "/" + /*trafficAccident*/ ctx[39].year);
    			add_location(a, file$e, 329, 28, 13442);
    			add_location(td0, file$e, 329, 24, 13438);
    			add_location(td1, file$e, 330, 24, 13583);
    			add_location(td2, file$e, 331, 24, 13640);
    			add_location(td3, file$e, 332, 24, 13714);
    			add_location(td4, file$e, 333, 24, 13771);
    			add_location(td5, file$e, 334, 24, 13831);
    			add_location(tr, file$e, 328, 20, 13408);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, tr, anchor);
    			append_dev(tr, td0);
    			append_dev(td0, a);
    			append_dev(a, t0);
    			append_dev(tr, t1);
    			append_dev(tr, td1);
    			append_dev(td1, t2);
    			append_dev(tr, t3);
    			append_dev(tr, td2);
    			append_dev(td2, t4);
    			append_dev(tr, t5);
    			append_dev(tr, td3);
    			append_dev(td3, t6);
    			append_dev(tr, t7);
    			append_dev(tr, td4);
    			append_dev(td4, t8);
    			append_dev(tr, t9);
    			append_dev(tr, td5);
    			mount_component(button, td5, null);
    			append_dev(tr, t10);
    			current = true;
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			if ((!current || dirty[0] & /*trafficAccidents*/ 1024) && t0_value !== (t0_value = /*trafficAccident*/ ctx[39].province + "")) set_data_dev(t0, t0_value);

    			if (!current || dirty[0] & /*trafficAccidents*/ 1024 && a_href_value !== (a_href_value = "#/traffic-accidents/" + /*trafficAccident*/ ctx[39].province + "/" + /*trafficAccident*/ ctx[39].year)) {
    				attr_dev(a, "href", a_href_value);
    			}

    			if ((!current || dirty[0] & /*trafficAccidents*/ 1024) && t2_value !== (t2_value = /*trafficAccident*/ ctx[39].year + "")) set_data_dev(t2, t2_value);
    			if ((!current || dirty[0] & /*trafficAccidents*/ 1024) && t4_value !== (t4_value = /*trafficAccident*/ ctx[39].trafficaccidentvictim + "")) set_data_dev(t4, t4_value);
    			if ((!current || dirty[0] & /*trafficAccidents*/ 1024) && t6_value !== (t6_value = /*trafficAccident*/ ctx[39].dead + "")) set_data_dev(t6, t6_value);
    			if ((!current || dirty[0] & /*trafficAccidents*/ 1024) && t8_value !== (t8_value = /*trafficAccident*/ ctx[39].injured + "")) set_data_dev(t8, t8_value);
    			const button_changes = {};

    			if (dirty[1] & /*$$scope*/ 2048) {
    				button_changes.$$scope = { dirty, ctx };
    			}

    			button.$set(button_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(button.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(button.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(tr);
    			destroy_component(button);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$2.name,
    		type: "each",
    		source: "(328:16) {#each trafficAccidents as trafficAccident}",
    		ctx
    	});

    	return block;
    }

    // (308:8) <Table bordered>
    function create_default_slot_11$2(ctx) {
    	let thead;
    	let tr0;
    	let th0;
    	let t1;
    	let th1;
    	let t3;
    	let th2;
    	let t5;
    	let th3;
    	let t7;
    	let th4;
    	let t9;
    	let th5;
    	let t11;
    	let tbody;
    	let tr1;
    	let td0;
    	let input0;
    	let t12;
    	let td1;
    	let input1;
    	let t13;
    	let td2;
    	let input2;
    	let t14;
    	let td3;
    	let input3;
    	let t15;
    	let td4;
    	let input4;
    	let t16;
    	let td5;
    	let t17;
    	let current;
    	let dispose;

    	const button = new Button({
    			props: {
    				outline: true,
    				color: "primary",
    				$$slots: { default: [create_default_slot_13$2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	button.$on("click", /*insertTrafficAccident*/ ctx[11]);
    	let each_value = /*trafficAccidents*/ ctx[10];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$2(get_each_context$2(ctx, each_value, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	const block = {
    		c: function create() {
    			thead = element("thead");
    			tr0 = element("tr");
    			th0 = element("th");
    			th0.textContent = "Provincia";
    			t1 = space();
    			th1 = element("th");
    			th1.textContent = "Año";
    			t3 = space();
    			th2 = element("th");
    			th2.textContent = "Accidentes con víctimas";
    			t5 = space();
    			th3 = element("th");
    			th3.textContent = "Fallecidos";
    			t7 = space();
    			th4 = element("th");
    			th4.textContent = "Heridos";
    			t9 = space();
    			th5 = element("th");
    			th5.textContent = "Acción";
    			t11 = space();
    			tbody = element("tbody");
    			tr1 = element("tr");
    			td0 = element("td");
    			input0 = element("input");
    			t12 = space();
    			td1 = element("td");
    			input1 = element("input");
    			t13 = space();
    			td2 = element("td");
    			input2 = element("input");
    			t14 = space();
    			td3 = element("td");
    			input3 = element("input");
    			t15 = space();
    			td4 = element("td");
    			input4 = element("input");
    			t16 = space();
    			td5 = element("td");
    			create_component(button.$$.fragment);
    			t17 = space();

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			add_location(th0, file$e, 310, 20, 12402);
    			add_location(th1, file$e, 311, 20, 12442);
    			add_location(th2, file$e, 312, 20, 12476);
    			add_location(th3, file$e, 313, 20, 12530);
    			add_location(th4, file$e, 314, 20, 12571);
    			add_location(th5, file$e, 315, 20, 12609);
    			add_location(tr0, file$e, 309, 16, 12376);
    			add_location(thead, file$e, 308, 12, 12351);
    			attr_dev(input0, "type", "text");
    			add_location(input0, file$e, 320, 24, 12738);
    			add_location(td0, file$e, 320, 20, 12734);
    			attr_dev(input1, "type", "number");
    			add_location(input1, file$e, 321, 24, 12831);
    			add_location(td1, file$e, 321, 20, 12827);
    			attr_dev(input2, "type", "number");
    			add_location(input2, file$e, 322, 24, 12922);
    			add_location(td2, file$e, 322, 20, 12918);
    			attr_dev(input3, "type", "number");
    			add_location(input3, file$e, 323, 24, 13030);
    			add_location(td3, file$e, 323, 20, 13026);
    			attr_dev(input4, "type", "number");
    			add_location(input4, file$e, 324, 24, 13121);
    			add_location(td4, file$e, 324, 20, 13117);
    			add_location(td5, file$e, 325, 20, 13211);
    			add_location(tr1, file$e, 319, 16, 12708);
    			add_location(tbody, file$e, 318, 12, 12683);
    		},
    		m: function mount(target, anchor, remount) {
    			insert_dev(target, thead, anchor);
    			append_dev(thead, tr0);
    			append_dev(tr0, th0);
    			append_dev(tr0, t1);
    			append_dev(tr0, th1);
    			append_dev(tr0, t3);
    			append_dev(tr0, th2);
    			append_dev(tr0, t5);
    			append_dev(tr0, th3);
    			append_dev(tr0, t7);
    			append_dev(tr0, th4);
    			append_dev(tr0, t9);
    			append_dev(tr0, th5);
    			insert_dev(target, t11, anchor);
    			insert_dev(target, tbody, anchor);
    			append_dev(tbody, tr1);
    			append_dev(tr1, td0);
    			append_dev(td0, input0);
    			set_input_value(input0, /*newTrafficAccident*/ ctx[0].province);
    			append_dev(tr1, t12);
    			append_dev(tr1, td1);
    			append_dev(td1, input1);
    			set_input_value(input1, /*newTrafficAccident*/ ctx[0].year);
    			append_dev(tr1, t13);
    			append_dev(tr1, td2);
    			append_dev(td2, input2);
    			set_input_value(input2, /*newTrafficAccident*/ ctx[0].trafficaccidentvictim);
    			append_dev(tr1, t14);
    			append_dev(tr1, td3);
    			append_dev(td3, input3);
    			set_input_value(input3, /*newTrafficAccident*/ ctx[0].dead);
    			append_dev(tr1, t15);
    			append_dev(tr1, td4);
    			append_dev(td4, input4);
    			set_input_value(input4, /*newTrafficAccident*/ ctx[0].injured);
    			append_dev(tr1, t16);
    			append_dev(tr1, td5);
    			mount_component(button, td5, null);
    			append_dev(tbody, t17);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(tbody, null);
    			}

    			current = true;
    			if (remount) run_all(dispose);

    			dispose = [
    				listen_dev(input0, "input", /*input0_input_handler*/ ctx[30]),
    				listen_dev(input1, "input", /*input1_input_handler*/ ctx[31]),
    				listen_dev(input2, "input", /*input2_input_handler*/ ctx[32]),
    				listen_dev(input3, "input", /*input3_input_handler*/ ctx[33]),
    				listen_dev(input4, "input", /*input4_input_handler*/ ctx[34])
    			];
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*newTrafficAccident*/ 1 && input0.value !== /*newTrafficAccident*/ ctx[0].province) {
    				set_input_value(input0, /*newTrafficAccident*/ ctx[0].province);
    			}

    			if (dirty[0] & /*newTrafficAccident*/ 1 && to_number(input1.value) !== /*newTrafficAccident*/ ctx[0].year) {
    				set_input_value(input1, /*newTrafficAccident*/ ctx[0].year);
    			}

    			if (dirty[0] & /*newTrafficAccident*/ 1 && to_number(input2.value) !== /*newTrafficAccident*/ ctx[0].trafficaccidentvictim) {
    				set_input_value(input2, /*newTrafficAccident*/ ctx[0].trafficaccidentvictim);
    			}

    			if (dirty[0] & /*newTrafficAccident*/ 1 && to_number(input3.value) !== /*newTrafficAccident*/ ctx[0].dead) {
    				set_input_value(input3, /*newTrafficAccident*/ ctx[0].dead);
    			}

    			if (dirty[0] & /*newTrafficAccident*/ 1 && to_number(input4.value) !== /*newTrafficAccident*/ ctx[0].injured) {
    				set_input_value(input4, /*newTrafficAccident*/ ctx[0].injured);
    			}

    			const button_changes = {};

    			if (dirty[1] & /*$$scope*/ 2048) {
    				button_changes.$$scope = { dirty, ctx };
    			}

    			button.$set(button_changes);

    			if (dirty[0] & /*deleteAccident, trafficAccidents*/ 5120) {
    				each_value = /*trafficAccidents*/ ctx[10];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$2(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block$2(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(tbody, null);
    					}
    				}

    				group_outros();

    				for (i = each_value.length; i < each_blocks.length; i += 1) {
    					out(i);
    				}

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(button.$$.fragment, local);

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(button.$$.fragment, local);
    			each_blocks = each_blocks.filter(Boolean);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(thead);
    			if (detaching) detach_dev(t11);
    			if (detaching) detach_dev(tbody);
    			destroy_component(button);
    			destroy_each(each_blocks, detaching);
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_11$2.name,
    		type: "slot",
    		source: "(308:8) <Table bordered>",
    		ctx
    	});

    	return block;
    }

    // (340:8) <Button outline color="primary" on:click={loadInitialData} style="float: left;">
    function create_default_slot_10$2(ctx) {
    	let i;
    	let t;

    	const block = {
    		c: function create() {
    			i = element("i");
    			t = text(" Inicializar");
    			attr_dev(i, "class", "fas fa-spinner");
    			add_location(i, file$e, 339, 89, 14192);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, i, anchor);
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(i);
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_10$2.name,
    		type: "slot",
    		source: "(340:8) <Button outline color=\\\"primary\\\" on:click={loadInitialData} style=\\\"float: left;\\\">",
    		ctx
    	});

    	return block;
    }

    // (341:8) <Button outline color="danger" on:click={deleteAllAccidents} style="float: right;">
    function create_default_slot_9$2(ctx) {
    	let i;
    	let t;

    	const block = {
    		c: function create() {
    			i = element("i");
    			t = text(" Borrar todo");
    			attr_dev(i, "class", "fa fa-trash");
    			attr_dev(i, "aria-hidden", "true");
    			add_location(i, file$e, 340, 91, 14336);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, i, anchor);
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(i);
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_9$2.name,
    		type: "slot",
    		source: "(341:8) <Button outline color=\\\"danger\\\" on:click={deleteAllAccidents} style=\\\"float: right;\\\">",
    		ctx
    	});

    	return block;
    }

    // (223:29)           Loading Traffic Accidents...      {:then trafficAccidents}
    function create_pending_block$4(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Loading Traffic Accidents...");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_pending_block$4.name,
    		type: "pending",
    		source: "(223:29)           Loading Traffic Accidents...      {:then trafficAccidents}",
    		ctx
    	});

    	return block;
    }

    // (346:8) <PaginationItem class="{currentPage === 1 ? 'disabled' : ''}">
    function create_default_slot_8$2(ctx) {
    	let current;

    	const paginationlink = new PaginationLink({
    			props: {
    				previous: true,
    				href: "#/traffic-accidents"
    			},
    			$$inline: true
    		});

    	paginationlink.$on("click", /*click_handler*/ ctx[35]);

    	const block = {
    		c: function create() {
    			create_component(paginationlink.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(paginationlink, target, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(paginationlink.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(paginationlink.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(paginationlink, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_8$2.name,
    		type: "slot",
    		source: "(346:8) <PaginationItem class=\\\"{currentPage === 1 ? 'disabled' : ''}\\\">",
    		ctx
    	});

    	return block;
    }

    // (350:8) {#if currentPage != 1}
    function create_if_block_1$5(ctx) {
    	let current;

    	const paginationitem = new PaginationItem({
    			props: {
    				$$slots: { default: [create_default_slot_6$2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(paginationitem.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(paginationitem, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const paginationitem_changes = {};

    			if (dirty[0] & /*currentPage*/ 2 | dirty[1] & /*$$scope*/ 2048) {
    				paginationitem_changes.$$scope = { dirty, ctx };
    			}

    			paginationitem.$set(paginationitem_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(paginationitem.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(paginationitem.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(paginationitem, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$5.name,
    		type: "if",
    		source: "(350:8) {#if currentPage != 1}",
    		ctx
    	});

    	return block;
    }

    // (352:16) <PaginationLink href="#/traffic-accidents" on:click="{() => upOffset(-1)}" >
    function create_default_slot_7$2(ctx) {
    	let t_value = /*currentPage*/ ctx[1] - 1 + "";
    	let t;

    	const block = {
    		c: function create() {
    			t = text(t_value);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*currentPage*/ 2 && t_value !== (t_value = /*currentPage*/ ctx[1] - 1 + "")) set_data_dev(t, t_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_7$2.name,
    		type: "slot",
    		source: "(352:16) <PaginationLink href=\\\"#/traffic-accidents\\\" on:click=\\\"{() => upOffset(-1)}\\\" >",
    		ctx
    	});

    	return block;
    }

    // (351:12) <PaginationItem>
    function create_default_slot_6$2(ctx) {
    	let current;

    	const paginationlink = new PaginationLink({
    			props: {
    				href: "#/traffic-accidents",
    				$$slots: { default: [create_default_slot_7$2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	paginationlink.$on("click", /*click_handler_1*/ ctx[36]);

    	const block = {
    		c: function create() {
    			create_component(paginationlink.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(paginationlink, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const paginationlink_changes = {};

    			if (dirty[0] & /*currentPage*/ 2 | dirty[1] & /*$$scope*/ 2048) {
    				paginationlink_changes.$$scope = { dirty, ctx };
    			}

    			paginationlink.$set(paginationlink_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(paginationlink.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(paginationlink.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(paginationlink, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_6$2.name,
    		type: "slot",
    		source: "(351:12) <PaginationItem>",
    		ctx
    	});

    	return block;
    }

    // (356:12) <PaginationLink href="#/traffic-accidents" >
    function create_default_slot_5$2(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text(/*currentPage*/ ctx[1]);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*currentPage*/ 2) set_data_dev(t, /*currentPage*/ ctx[1]);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_5$2.name,
    		type: "slot",
    		source: "(356:12) <PaginationLink href=\\\"#/traffic-accidents\\\" >",
    		ctx
    	});

    	return block;
    }

    // (355:8) <PaginationItem active>
    function create_default_slot_4$2(ctx) {
    	let current;

    	const paginationlink = new PaginationLink({
    			props: {
    				href: "#/traffic-accidents",
    				$$slots: { default: [create_default_slot_5$2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(paginationlink.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(paginationlink, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const paginationlink_changes = {};

    			if (dirty[0] & /*currentPage*/ 2 | dirty[1] & /*$$scope*/ 2048) {
    				paginationlink_changes.$$scope = { dirty, ctx };
    			}

    			paginationlink.$set(paginationlink_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(paginationlink.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(paginationlink.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(paginationlink, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_4$2.name,
    		type: "slot",
    		source: "(355:8) <PaginationItem active>",
    		ctx
    	});

    	return block;
    }

    // (359:8) {#if moreData}
    function create_if_block$a(ctx) {
    	let current;

    	const paginationitem = new PaginationItem({
    			props: {
    				$$slots: { default: [create_default_slot_2$4] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(paginationitem.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(paginationitem, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const paginationitem_changes = {};

    			if (dirty[0] & /*currentPage*/ 2 | dirty[1] & /*$$scope*/ 2048) {
    				paginationitem_changes.$$scope = { dirty, ctx };
    			}

    			paginationitem.$set(paginationitem_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(paginationitem.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(paginationitem.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(paginationitem, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$a.name,
    		type: "if",
    		source: "(359:8) {#if moreData}",
    		ctx
    	});

    	return block;
    }

    // (361:16) <PaginationLink href="#/traffic-accidents" on:click="{() => upOffset(1)}">
    function create_default_slot_3$2(ctx) {
    	let t_value = /*currentPage*/ ctx[1] + 1 + "";
    	let t;

    	const block = {
    		c: function create() {
    			t = text(t_value);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*currentPage*/ 2 && t_value !== (t_value = /*currentPage*/ ctx[1] + 1 + "")) set_data_dev(t, t_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_3$2.name,
    		type: "slot",
    		source: "(361:16) <PaginationLink href=\\\"#/traffic-accidents\\\" on:click=\\\"{() => upOffset(1)}\\\">",
    		ctx
    	});

    	return block;
    }

    // (360:12) <PaginationItem >
    function create_default_slot_2$4(ctx) {
    	let current;

    	const paginationlink = new PaginationLink({
    			props: {
    				href: "#/traffic-accidents",
    				$$slots: { default: [create_default_slot_3$2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	paginationlink.$on("click", /*click_handler_2*/ ctx[37]);

    	const block = {
    		c: function create() {
    			create_component(paginationlink.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(paginationlink, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const paginationlink_changes = {};

    			if (dirty[0] & /*currentPage*/ 2 | dirty[1] & /*$$scope*/ 2048) {
    				paginationlink_changes.$$scope = { dirty, ctx };
    			}

    			paginationlink.$set(paginationlink_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(paginationlink.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(paginationlink.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(paginationlink, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_2$4.name,
    		type: "slot",
    		source: "(360:12) <PaginationItem >",
    		ctx
    	});

    	return block;
    }

    // (364:8) <PaginationItem class="{moreData ? '' : 'disabled'}">
    function create_default_slot_1$4(ctx) {
    	let current;

    	const paginationlink = new PaginationLink({
    			props: { next: true, href: "#/traffic-accidents" },
    			$$inline: true
    		});

    	paginationlink.$on("click", /*click_handler_3*/ ctx[38]);

    	const block = {
    		c: function create() {
    			create_component(paginationlink.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(paginationlink, target, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(paginationlink.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(paginationlink.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(paginationlink, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1$4.name,
    		type: "slot",
    		source: "(364:8) <PaginationItem class=\\\"{moreData ? '' : 'disabled'}\\\">",
    		ctx
    	});

    	return block;
    }

    // (344:4) <Pagination ariaLabel="Cambiar de página" style="padding-left: 45%;">
    function create_default_slot$4(ctx) {
    	let t0;
    	let t1;
    	let t2;
    	let t3;
    	let current;

    	const paginationitem0 = new PaginationItem({
    			props: {
    				class: /*currentPage*/ ctx[1] === 1 ? "disabled" : "",
    				$$slots: { default: [create_default_slot_8$2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	let if_block0 = /*currentPage*/ ctx[1] != 1 && create_if_block_1$5(ctx);

    	const paginationitem1 = new PaginationItem({
    			props: {
    				active: true,
    				$$slots: { default: [create_default_slot_4$2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	let if_block1 = /*moreData*/ ctx[2] && create_if_block$a(ctx);

    	const paginationitem2 = new PaginationItem({
    			props: {
    				class: /*moreData*/ ctx[2] ? "" : "disabled",
    				$$slots: { default: [create_default_slot_1$4] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(paginationitem0.$$.fragment);
    			t0 = space();
    			if (if_block0) if_block0.c();
    			t1 = space();
    			create_component(paginationitem1.$$.fragment);
    			t2 = space();
    			if (if_block1) if_block1.c();
    			t3 = space();
    			create_component(paginationitem2.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(paginationitem0, target, anchor);
    			insert_dev(target, t0, anchor);
    			if (if_block0) if_block0.m(target, anchor);
    			insert_dev(target, t1, anchor);
    			mount_component(paginationitem1, target, anchor);
    			insert_dev(target, t2, anchor);
    			if (if_block1) if_block1.m(target, anchor);
    			insert_dev(target, t3, anchor);
    			mount_component(paginationitem2, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const paginationitem0_changes = {};
    			if (dirty[0] & /*currentPage*/ 2) paginationitem0_changes.class = /*currentPage*/ ctx[1] === 1 ? "disabled" : "";

    			if (dirty[1] & /*$$scope*/ 2048) {
    				paginationitem0_changes.$$scope = { dirty, ctx };
    			}

    			paginationitem0.$set(paginationitem0_changes);

    			if (/*currentPage*/ ctx[1] != 1) {
    				if (if_block0) {
    					if_block0.p(ctx, dirty);

    					if (dirty[0] & /*currentPage*/ 2) {
    						transition_in(if_block0, 1);
    					}
    				} else {
    					if_block0 = create_if_block_1$5(ctx);
    					if_block0.c();
    					transition_in(if_block0, 1);
    					if_block0.m(t1.parentNode, t1);
    				}
    			} else if (if_block0) {
    				group_outros();

    				transition_out(if_block0, 1, 1, () => {
    					if_block0 = null;
    				});

    				check_outros();
    			}

    			const paginationitem1_changes = {};

    			if (dirty[0] & /*currentPage*/ 2 | dirty[1] & /*$$scope*/ 2048) {
    				paginationitem1_changes.$$scope = { dirty, ctx };
    			}

    			paginationitem1.$set(paginationitem1_changes);

    			if (/*moreData*/ ctx[2]) {
    				if (if_block1) {
    					if_block1.p(ctx, dirty);

    					if (dirty[0] & /*moreData*/ 4) {
    						transition_in(if_block1, 1);
    					}
    				} else {
    					if_block1 = create_if_block$a(ctx);
    					if_block1.c();
    					transition_in(if_block1, 1);
    					if_block1.m(t3.parentNode, t3);
    				}
    			} else if (if_block1) {
    				group_outros();

    				transition_out(if_block1, 1, 1, () => {
    					if_block1 = null;
    				});

    				check_outros();
    			}

    			const paginationitem2_changes = {};
    			if (dirty[0] & /*moreData*/ 4) paginationitem2_changes.class = /*moreData*/ ctx[2] ? "" : "disabled";

    			if (dirty[1] & /*$$scope*/ 2048) {
    				paginationitem2_changes.$$scope = { dirty, ctx };
    			}

    			paginationitem2.$set(paginationitem2_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(paginationitem0.$$.fragment, local);
    			transition_in(if_block0);
    			transition_in(paginationitem1.$$.fragment, local);
    			transition_in(if_block1);
    			transition_in(paginationitem2.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(paginationitem0.$$.fragment, local);
    			transition_out(if_block0);
    			transition_out(paginationitem1.$$.fragment, local);
    			transition_out(if_block1);
    			transition_out(paginationitem2.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(paginationitem0, detaching);
    			if (detaching) detach_dev(t0);
    			if (if_block0) if_block0.d(detaching);
    			if (detaching) detach_dev(t1);
    			destroy_component(paginationitem1, detaching);
    			if (detaching) detach_dev(t2);
    			if (if_block1) if_block1.d(detaching);
    			if (detaching) detach_dev(t3);
    			destroy_component(paginationitem2, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$4.name,
    		type: "slot",
    		source: "(344:4) <Pagination ariaLabel=\\\"Cambiar de página\\\" style=\\\"padding-left: 45%;\\\">",
    		ctx
    	});

    	return block;
    }

    function create_fragment$h(ctx) {
    	let main;
    	let h2;
    	let i;
    	let t0;
    	let t1;
    	let t2;
    	let t3;
    	let promise;
    	let t4;
    	let current;

    	const button = new Button({
    			props: {
    				outline: true,
    				color: "secondary",
    				$$slots: { default: [create_default_slot_20] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	button.$on("click", pop);
    	let if_block = /*successMsg*/ ctx[7] && create_if_block_3$2(ctx);

    	let info = {
    		ctx,
    		current: null,
    		token: null,
    		pending: create_pending_block$4,
    		then: create_then_block$4,
    		catch: create_catch_block$4,
    		value: 10,
    		blocks: [,,,]
    	};

    	handle_promise(promise = /*trafficAccidents*/ ctx[10], info);

    	const pagination = new Pagination({
    			props: {
    				ariaLabel: "Cambiar de página",
    				style: "padding-left: 45%;",
    				$$slots: { default: [create_default_slot$4] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			main = element("main");
    			h2 = element("h2");
    			i = element("i");
    			t0 = text(" Accidentes de Tráfico");
    			t1 = space();
    			create_component(button.$$.fragment);
    			t2 = space();
    			if (if_block) if_block.c();
    			t3 = space();
    			info.block.c();
    			t4 = space();
    			create_component(pagination.$$.fragment);
    			attr_dev(i, "class", "fas fa-car");
    			add_location(i, file$e, 215, 37, 7503);
    			set_style(h2, "text-align", "center");
    			add_location(h2, file$e, 215, 4, 7470);
    			add_location(main, file$e, 213, 0, 7456);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			append_dev(main, h2);
    			append_dev(h2, i);
    			append_dev(h2, t0);
    			append_dev(main, t1);
    			mount_component(button, main, null);
    			append_dev(main, t2);
    			if (if_block) if_block.m(main, null);
    			append_dev(main, t3);
    			info.block.m(main, info.anchor = null);
    			info.mount = () => main;
    			info.anchor = t4;
    			append_dev(main, t4);
    			mount_component(pagination, main, null);
    			current = true;
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			const button_changes = {};

    			if (dirty[1] & /*$$scope*/ 2048) {
    				button_changes.$$scope = { dirty, ctx };
    			}

    			button.$set(button_changes);

    			if (/*successMsg*/ ctx[7]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block_3$2(ctx);
    					if_block.c();
    					if_block.m(main, t3);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}

    			info.ctx = ctx;

    			if (dirty[0] & /*trafficAccidents*/ 1024 && promise !== (promise = /*trafficAccidents*/ ctx[10]) && handle_promise(promise, info)) ; else {
    				const child_ctx = ctx.slice();
    				child_ctx[10] = info.resolved;
    				info.block.p(child_ctx, dirty);
    			}

    			const pagination_changes = {};

    			if (dirty[0] & /*moreData, currentPage*/ 6 | dirty[1] & /*$$scope*/ 2048) {
    				pagination_changes.$$scope = { dirty, ctx };
    			}

    			pagination.$set(pagination_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(button.$$.fragment, local);
    			transition_in(info.block);
    			transition_in(pagination.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(button.$$.fragment, local);

    			for (let i = 0; i < 3; i += 1) {
    				const block = info.blocks[i];
    				transition_out(block);
    			}

    			transition_out(pagination.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			destroy_component(button);
    			if (if_block) if_block.d();
    			info.block.d();
    			info.token = null;
    			info = null;
    			destroy_component(pagination);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$h.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$h($$self, $$props, $$invalidate) {
    	let trafficAccidents = [];

    	let newTrafficAccident = {
    		province: "",
    		year: 0,
    		trafficaccidentvictim: 0,
    		dead: 0,
    		injured: 0
    	};

    	let numberObject = 10;
    	let offset = 0;
    	let currentPage = 1;
    	let moreData = true;
    	let buscar = "";
    	let valores = "";
    	let buscar2 = "";
    	let valores2 = "";
    	let object = "";
    	let successMsg = "";
    	let success = "";
    	let errorMsg = "";
    	let combinada = false;
    	onMount(getTrafficAccidents);

    	async function getTrafficAccidents() {
    		const res = await fetch("/api/v2/traffic-accidents?offset=" + numberObject * offset + "&limit=" + numberObject);
    		const resNext = await fetch("/api/v2/traffic-accidents?offset=" + numberObject * (offset + 1) + "&limit=" + numberObject);
    		console.log("Fetching Traffic Accidents...");

    		if (res.ok && resNext.ok) {
    			console.log("OK: ");
    			const json = await res.json();
    			const jsonNext = await resNext.json();
    			$$invalidate(10, trafficAccidents = json);

    			if (jsonNext.length == 0) {
    				$$invalidate(2, moreData = false);
    			} else {
    				$$invalidate(2, moreData = true);
    			}

    			console.log("Received " + trafficAccidents.length + "traffic-accidents.");
    		} else {
    			console.log("ERROR!");
    		}
    	}

    	async function insertTrafficAccident() {
    		console.log("Inserting Traffic Accidents..." + JSON.stringify(newTrafficAccident));

    		const res = await fetch("/api/v2/traffic-accidents", {
    			method: "POST",
    			body: JSON.stringify(newTrafficAccident),
    			headers: { "Content-Type": "application/json" }
    		}).then(function (res) {
    			getTrafficAccidents();
    			object = newTrafficAccident.province;

    			if (res.ok) {
    				$$invalidate(7, successMsg = res.status + ": " + res.statusText);
    				console.log(successMsg);
    				$$invalidate(8, success = "El dato " + newTrafficAccident.province + " " + newTrafficAccident.year + " ha sido insertado con exito.");
    			} else if (res.status == 400) {
    				errorMsg = res.status + ": " + res.statusText;
    				window.alert("Error! Rellene todos los campos.");
    				console.log(errorMsg);
    			} else if (res.status == 409) {
    				errorMsg = res.status + ": " + res.statusText;
    				window.alert("Error! El objeto " + newTrafficAccident.province + " " + newTrafficAccident.year + " ya existe.");
    				console.log(errorMsg);
    			}

    			
    		});
    	}

    	async function deleteAccident(province, year) {
    		console.log("Deleting Traffic Accidents...");

    		const res = await fetch("/api/v2/traffic-accidents/" + province + "/" + year, { method: "DELETE" }).then(function (res) {
    			getTrafficAccidents();

    			if (res.ok) {
    				$$invalidate(7, successMsg = res.status + ": " + res.statusText);
    				console.log(successMsg);
    				$$invalidate(8, success = "El dato " + province + " " + year + " se ha borrado correctamente.");
    			} else if (res.status == 404) {
    				errorMsg = res.status + ": " + res.statusText;
    				window.alert("Error! El dato " + province + " " + year + " no se ha podido borrar.");
    				console.log(errorMsg);
    			}

    			
    		});
    	}

    	async function deleteAllAccidents() {
    		console.log("Deleting All Traffic Accidents...");

    		const res = await fetch("/api/v2/traffic-accidents", { method: "DELETE" }).then(function (res) {
    			getTrafficAccidents();

    			if (res.ok) {
    				$$invalidate(7, successMsg = res.status + ": " + res.statusText);
    				console.log(successMsg);
    				$$invalidate(8, success = "Los datos se han borrado correctamente.");
    			}

    			
    		});
    	}

    	async function loadInitialData() {
    		const res = await fetch("/api/v2/traffic-accidents/loadInitialData", { method: "GET" }).then(function (res) {
    			getTrafficAccidents();

    			if (res.ok) {
    				$$invalidate(7, successMsg = res.status + ": " + res.statusText);
    				console.log(successMsg);
    				$$invalidate(8, success = "Los datos iniciales se han introducido correctamente.");
    			}

    			
    		});
    	}

    	async function findObject(buscar, valores) {
    		offset = 0;
    		$$invalidate(1, currentPage = 1);
    		$$invalidate(2, moreData = false);
    		console.log("Searching " + valores + " for " + buscar + " Traffic Accidents...");
    		var url = "/api/v2/traffic-accidents";

    		if (buscar != "" && valores != "") {
    			url = url + "?" + buscar + "=" + valores;
    		}

    		const res = await fetch(url);

    		if (res.ok) {
    			console.log("OK: ");
    			const json = await res.json();
    			$$invalidate(10, trafficAccidents = json);
    			$$invalidate(7, successMsg = res.status + ": " + res.statusText);
    			console.log(successMsg);
    			$$invalidate(8, success = "Se han encontrado " + trafficAccidents.length + " datos en la busqueda.");
    			console.log("Found " + trafficAccidents.length + "traffic-accidents.");
    		} else {
    			window.alert("ERROR: Introduzca correctamente los valores para la busqueda.");
    			errorMsg = res.status + ": " + res.statusText;
    			console.log("ERROR!" + errorMsg);
    		}
    	}

    	async function findObject2(buscar, valores, buscar2, valores2) {
    		offset = 0;
    		$$invalidate(1, currentPage = 1);
    		$$invalidate(2, moreData = false);
    		console.log("Searching " + valores + " for " + buscar + " and " + valores2 + " for " + buscar2 + " Traffic Accidents...");
    		var url = "/api/v2/traffic-accidents";

    		if (buscar != "" && valores != "" && buscar2 != "" && valores2 != "") {
    			url = url + "?" + buscar + "=" + valores + "&" + buscar2 + "=" + valores2;
    		} else {
    			window.alert("Los campos para la busqueda deben estar rellenos.");
    			errorMsg = res.status + ": " + res.statusText;
    			console.log("ERROR!" + errorMsg);
    		}

    		const res = await fetch(url);

    		if (res.ok) {
    			console.log("OK: ");
    			const json = await res.json();
    			$$invalidate(10, trafficAccidents = json);
    			$$invalidate(7, successMsg = res.status + ": " + res.statusText);
    			console.log(successMsg);
    			$$invalidate(8, success = "Se han encontrado " + trafficAccidents.length + " datos en la busqueda.");
    			console.log("Found " + trafficAccidents.length + "traffic-accidents.");
    		} else {
    			window.alert("ERROR: Introduzca correctamente los valores para la busqueda.");
    			console.log("ERROR!");
    		}
    	}

    	function upOffset(numPag) {
    		offset += numPag;
    		$$invalidate(1, currentPage += numPag);
    		getTrafficAccidents();
    	}

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console_1$6.warn(`<AccidentsTrafficsTable> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("AccidentsTrafficsTable", $$slots, []);

    	function input_change_handler() {
    		combinada = this.checked;
    		$$invalidate(9, combinada);
    	}

    	function input0_value_binding(value) {
    		buscar = value;
    		$$invalidate(3, buscar);
    	}

    	function input1_value_binding(value) {
    		valores = value;
    		$$invalidate(4, valores);
    	}

    	function input2_value_binding(value) {
    		buscar2 = value;
    		$$invalidate(5, buscar2);
    	}

    	function input3_value_binding(value) {
    		valores2 = value;
    		$$invalidate(6, valores2);
    	}

    	function input0_value_binding_1(value) {
    		buscar = value;
    		$$invalidate(3, buscar);
    	}

    	function input1_value_binding_1(value) {
    		valores = value;
    		$$invalidate(4, valores);
    	}

    	function input0_input_handler() {
    		newTrafficAccident.province = this.value;
    		$$invalidate(0, newTrafficAccident);
    	}

    	function input1_input_handler() {
    		newTrafficAccident.year = to_number(this.value);
    		$$invalidate(0, newTrafficAccident);
    	}

    	function input2_input_handler() {
    		newTrafficAccident.trafficaccidentvictim = to_number(this.value);
    		$$invalidate(0, newTrafficAccident);
    	}

    	function input3_input_handler() {
    		newTrafficAccident.dead = to_number(this.value);
    		$$invalidate(0, newTrafficAccident);
    	}

    	function input4_input_handler() {
    		newTrafficAccident.injured = to_number(this.value);
    		$$invalidate(0, newTrafficAccident);
    	}

    	const click_handler = () => upOffset(-1);
    	const click_handler_1 = () => upOffset(-1);
    	const click_handler_2 = () => upOffset(1);
    	const click_handler_3 = () => upOffset(1);

    	$$self.$capture_state = () => ({
    		onMount,
    		pop,
    		Table,
    		Button,
    		Input,
    		FormGroup,
    		Pagination,
    		PaginationItem,
    		PaginationLink,
    		trafficAccidents,
    		newTrafficAccident,
    		numberObject,
    		offset,
    		currentPage,
    		moreData,
    		buscar,
    		valores,
    		buscar2,
    		valores2,
    		object,
    		successMsg,
    		success,
    		errorMsg,
    		combinada,
    		getTrafficAccidents,
    		insertTrafficAccident,
    		deleteAccident,
    		deleteAllAccidents,
    		loadInitialData,
    		findObject,
    		findObject2,
    		upOffset
    	});

    	$$self.$inject_state = $$props => {
    		if ("trafficAccidents" in $$props) $$invalidate(10, trafficAccidents = $$props.trafficAccidents);
    		if ("newTrafficAccident" in $$props) $$invalidate(0, newTrafficAccident = $$props.newTrafficAccident);
    		if ("numberObject" in $$props) numberObject = $$props.numberObject;
    		if ("offset" in $$props) offset = $$props.offset;
    		if ("currentPage" in $$props) $$invalidate(1, currentPage = $$props.currentPage);
    		if ("moreData" in $$props) $$invalidate(2, moreData = $$props.moreData);
    		if ("buscar" in $$props) $$invalidate(3, buscar = $$props.buscar);
    		if ("valores" in $$props) $$invalidate(4, valores = $$props.valores);
    		if ("buscar2" in $$props) $$invalidate(5, buscar2 = $$props.buscar2);
    		if ("valores2" in $$props) $$invalidate(6, valores2 = $$props.valores2);
    		if ("object" in $$props) object = $$props.object;
    		if ("successMsg" in $$props) $$invalidate(7, successMsg = $$props.successMsg);
    		if ("success" in $$props) $$invalidate(8, success = $$props.success);
    		if ("errorMsg" in $$props) errorMsg = $$props.errorMsg;
    		if ("combinada" in $$props) $$invalidate(9, combinada = $$props.combinada);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		newTrafficAccident,
    		currentPage,
    		moreData,
    		buscar,
    		valores,
    		buscar2,
    		valores2,
    		successMsg,
    		success,
    		combinada,
    		trafficAccidents,
    		insertTrafficAccident,
    		deleteAccident,
    		deleteAllAccidents,
    		loadInitialData,
    		findObject,
    		findObject2,
    		upOffset,
    		offset,
    		object,
    		errorMsg,
    		numberObject,
    		getTrafficAccidents,
    		input_change_handler,
    		input0_value_binding,
    		input1_value_binding,
    		input2_value_binding,
    		input3_value_binding,
    		input0_value_binding_1,
    		input1_value_binding_1,
    		input0_input_handler,
    		input1_input_handler,
    		input2_input_handler,
    		input3_input_handler,
    		input4_input_handler,
    		click_handler,
    		click_handler_1,
    		click_handler_2,
    		click_handler_3
    	];
    }

    class AccidentsTrafficsTable extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$h, create_fragment$h, safe_not_equal, {}, [-1, -1]);

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "AccidentsTrafficsTable",
    			options,
    			id: create_fragment$h.name
    		});
    	}
    }

    /* src\front\accidentsAPI\EditAccidentsTraffics.svelte generated by Svelte v3.21.0 */

    const { console: console_1$7 } = globals;
    const file$f = "src\\front\\accidentsAPI\\EditAccidentsTraffics.svelte";

    // (83:4) {#if successMsg}
    function create_if_block$b(ctx) {
    	let p;
    	let t;

    	const block = {
    		c: function create() {
    			p = element("p");
    			t = text(/*success*/ ctx[6]);
    			set_style(p, "color", "green");
    			add_location(p, file$f, 83, 8, 3019);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, p, anchor);
    			append_dev(p, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*success*/ 64) set_data_dev(t, /*success*/ ctx[6]);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(p);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$b.name,
    		type: "if",
    		source: "(83:4) {#if successMsg}",
    		ctx
    	});

    	return block;
    }

    // (89:4) <Button outline color="secondary" on:click="{pop}">
    function create_default_slot_2$5(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Volver");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_2$5.name,
    		type: "slot",
    		source: "(89:4) <Button outline color=\\\"secondary\\\" on:click=\\\"{pop}\\\">",
    		ctx
    	});

    	return block;
    }

    // (1:0) <script>      import {          onMount      }
    function create_catch_block$5(ctx) {
    	const block = {
    		c: noop,
    		m: noop,
    		p: noop,
    		i: noop,
    		o: noop,
    		d: noop
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_catch_block$5.name,
    		type: "catch",
    		source: "(1:0) <script>      import {          onMount      }",
    		ctx
    	});

    	return block;
    }

    // (93:4) {:then trafficAccident}
    function create_then_block$5(ctx) {
    	let current;

    	const table = new Table({
    			props: {
    				$$slots: { default: [create_default_slot$5] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(table.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(table, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const table_changes = {};

    			if (dirty & /*$$scope, updateInjured, updateDead, updateTrafficaccidentvictim, updateYear, updateProvince*/ 32830) {
    				table_changes.$$scope = { dirty, ctx };
    			}

    			table.$set(table_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(table.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(table.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(table, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_then_block$5.name,
    		type: "then",
    		source: "(93:4) {:then trafficAccident}",
    		ctx
    	});

    	return block;
    }

    // (112:24) <Button outline color="primary" on:click={updateTrafficAccident}>
    function create_default_slot_1$5(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Actualizar");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1$5.name,
    		type: "slot",
    		source: "(112:24) <Button outline color=\\\"primary\\\" on:click={updateTrafficAccident}>",
    		ctx
    	});

    	return block;
    }

    // (94:8) <Table>
    function create_default_slot$5(ctx) {
    	let thead;
    	let tr0;
    	let th0;
    	let t1;
    	let th1;
    	let t3;
    	let th2;
    	let t5;
    	let th3;
    	let t7;
    	let th4;
    	let t9;
    	let th5;
    	let t11;
    	let tbody;
    	let tr1;
    	let td0;
    	let t12;
    	let t13;
    	let td1;
    	let t14;
    	let t15;
    	let td2;
    	let input0;
    	let t16;
    	let td3;
    	let input1;
    	let t17;
    	let td4;
    	let input2;
    	let t18;
    	let td5;
    	let current;
    	let dispose;

    	const button = new Button({
    			props: {
    				outline: true,
    				color: "primary",
    				$$slots: { default: [create_default_slot_1$5] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	button.$on("click", /*updateTrafficAccident*/ ctx[9]);

    	const block = {
    		c: function create() {
    			thead = element("thead");
    			tr0 = element("tr");
    			th0 = element("th");
    			th0.textContent = "Provincia";
    			t1 = space();
    			th1 = element("th");
    			th1.textContent = "Año";
    			t3 = space();
    			th2 = element("th");
    			th2.textContent = "Victimas de accidentes de trafico";
    			t5 = space();
    			th3 = element("th");
    			th3.textContent = "Muertos";
    			t7 = space();
    			th4 = element("th");
    			th4.textContent = "Heridos";
    			t9 = space();
    			th5 = element("th");
    			th5.textContent = "Accion";
    			t11 = space();
    			tbody = element("tbody");
    			tr1 = element("tr");
    			td0 = element("td");
    			t12 = text(/*updateProvince*/ ctx[1]);
    			t13 = space();
    			td1 = element("td");
    			t14 = text(/*updateYear*/ ctx[2]);
    			t15 = space();
    			td2 = element("td");
    			input0 = element("input");
    			t16 = space();
    			td3 = element("td");
    			input1 = element("input");
    			t17 = space();
    			td4 = element("td");
    			input2 = element("input");
    			t18 = space();
    			td5 = element("td");
    			create_component(button.$$.fragment);
    			add_location(th0, file$f, 96, 20, 3420);
    			add_location(th1, file$f, 97, 20, 3460);
    			add_location(th2, file$f, 98, 20, 3494);
    			add_location(th3, file$f, 99, 20, 3558);
    			add_location(th4, file$f, 100, 20, 3596);
    			add_location(th5, file$f, 101, 20, 3634);
    			add_location(tr0, file$f, 95, 16, 3394);
    			add_location(thead, file$f, 94, 12, 3369);
    			add_location(td0, file$f, 106, 20, 3759);
    			add_location(td1, file$f, 107, 20, 3806);
    			attr_dev(input0, "type", "number");
    			add_location(input0, file$f, 108, 24, 3853);
    			add_location(td2, file$f, 108, 20, 3849);
    			attr_dev(input1, "type", "number");
    			add_location(input1, file$f, 109, 24, 3948);
    			add_location(td3, file$f, 109, 20, 3944);
    			attr_dev(input2, "type", "number");
    			add_location(input2, file$f, 110, 24, 4026);
    			add_location(td4, file$f, 110, 20, 4022);
    			add_location(td5, file$f, 111, 20, 4103);
    			add_location(tr1, file$f, 105, 16, 3733);
    			add_location(tbody, file$f, 104, 12, 3708);
    		},
    		m: function mount(target, anchor, remount) {
    			insert_dev(target, thead, anchor);
    			append_dev(thead, tr0);
    			append_dev(tr0, th0);
    			append_dev(tr0, t1);
    			append_dev(tr0, th1);
    			append_dev(tr0, t3);
    			append_dev(tr0, th2);
    			append_dev(tr0, t5);
    			append_dev(tr0, th3);
    			append_dev(tr0, t7);
    			append_dev(tr0, th4);
    			append_dev(tr0, t9);
    			append_dev(tr0, th5);
    			insert_dev(target, t11, anchor);
    			insert_dev(target, tbody, anchor);
    			append_dev(tbody, tr1);
    			append_dev(tr1, td0);
    			append_dev(td0, t12);
    			append_dev(tr1, t13);
    			append_dev(tr1, td1);
    			append_dev(td1, t14);
    			append_dev(tr1, t15);
    			append_dev(tr1, td2);
    			append_dev(td2, input0);
    			set_input_value(input0, /*updateTrafficaccidentvictim*/ ctx[3]);
    			append_dev(tr1, t16);
    			append_dev(tr1, td3);
    			append_dev(td3, input1);
    			set_input_value(input1, /*updateDead*/ ctx[4]);
    			append_dev(tr1, t17);
    			append_dev(tr1, td4);
    			append_dev(td4, input2);
    			set_input_value(input2, /*updateInjured*/ ctx[5]);
    			append_dev(tr1, t18);
    			append_dev(tr1, td5);
    			mount_component(button, td5, null);
    			current = true;
    			if (remount) run_all(dispose);

    			dispose = [
    				listen_dev(input0, "input", /*input0_input_handler*/ ctx[12]),
    				listen_dev(input1, "input", /*input1_input_handler*/ ctx[13]),
    				listen_dev(input2, "input", /*input2_input_handler*/ ctx[14])
    			];
    		},
    		p: function update(ctx, dirty) {
    			if (!current || dirty & /*updateProvince*/ 2) set_data_dev(t12, /*updateProvince*/ ctx[1]);
    			if (!current || dirty & /*updateYear*/ 4) set_data_dev(t14, /*updateYear*/ ctx[2]);

    			if (dirty & /*updateTrafficaccidentvictim*/ 8 && to_number(input0.value) !== /*updateTrafficaccidentvictim*/ ctx[3]) {
    				set_input_value(input0, /*updateTrafficaccidentvictim*/ ctx[3]);
    			}

    			if (dirty & /*updateDead*/ 16 && to_number(input1.value) !== /*updateDead*/ ctx[4]) {
    				set_input_value(input1, /*updateDead*/ ctx[4]);
    			}

    			if (dirty & /*updateInjured*/ 32 && to_number(input2.value) !== /*updateInjured*/ ctx[5]) {
    				set_input_value(input2, /*updateInjured*/ ctx[5]);
    			}

    			const button_changes = {};

    			if (dirty & /*$$scope*/ 32768) {
    				button_changes.$$scope = { dirty, ctx };
    			}

    			button.$set(button_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(button.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(button.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(thead);
    			if (detaching) detach_dev(t11);
    			if (detaching) detach_dev(tbody);
    			destroy_component(button);
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$5.name,
    		type: "slot",
    		source: "(94:8) <Table>",
    		ctx
    	});

    	return block;
    }

    // (91:28)           Loading Traffic Accident...      {:then trafficAccident}
    function create_pending_block$5(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Loading Traffic Accident...");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_pending_block$5.name,
    		type: "pending",
    		source: "(91:28)           Loading Traffic Accident...      {:then trafficAccident}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$i(ctx) {
    	let main;
    	let t0;
    	let h3;
    	let t1;
    	let strong;
    	let t2_value = /*params*/ ctx[0].accidentProcince + "";
    	let t2;
    	let t3;
    	let t4_value = /*params*/ ctx[0].accidentYear + "";
    	let t4;
    	let t5;
    	let t6;
    	let promise;
    	let current;
    	let if_block = /*successMsg*/ ctx[7] && create_if_block$b(ctx);

    	const button = new Button({
    			props: {
    				outline: true,
    				color: "secondary",
    				$$slots: { default: [create_default_slot_2$5] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	button.$on("click", pop);

    	let info = {
    		ctx,
    		current: null,
    		token: null,
    		pending: create_pending_block$5,
    		then: create_then_block$5,
    		catch: create_catch_block$5,
    		value: 8,
    		blocks: [,,,]
    	};

    	handle_promise(promise = /*trafficAccident*/ ctx[8], info);

    	const block = {
    		c: function create() {
    			main = element("main");
    			if (if_block) if_block.c();
    			t0 = space();
    			h3 = element("h3");
    			t1 = text("Editar datos de: ");
    			strong = element("strong");
    			t2 = text(t2_value);
    			t3 = space();
    			t4 = text(t4_value);
    			t5 = space();
    			create_component(button.$$.fragment);
    			t6 = space();
    			info.block.c();
    			add_location(strong, file$f, 86, 25, 3097);
    			add_location(h3, file$f, 86, 4, 3076);
    			add_location(main, file$f, 81, 0, 2981);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			if (if_block) if_block.m(main, null);
    			append_dev(main, t0);
    			append_dev(main, h3);
    			append_dev(h3, t1);
    			append_dev(h3, strong);
    			append_dev(strong, t2);
    			append_dev(strong, t3);
    			append_dev(strong, t4);
    			append_dev(main, t5);
    			mount_component(button, main, null);
    			append_dev(main, t6);
    			info.block.m(main, info.anchor = null);
    			info.mount = () => main;
    			info.anchor = null;
    			current = true;
    		},
    		p: function update(new_ctx, [dirty]) {
    			ctx = new_ctx;

    			if (/*successMsg*/ ctx[7]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block$b(ctx);
    					if_block.c();
    					if_block.m(main, t0);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}

    			if ((!current || dirty & /*params*/ 1) && t2_value !== (t2_value = /*params*/ ctx[0].accidentProcince + "")) set_data_dev(t2, t2_value);
    			if ((!current || dirty & /*params*/ 1) && t4_value !== (t4_value = /*params*/ ctx[0].accidentYear + "")) set_data_dev(t4, t4_value);
    			const button_changes = {};

    			if (dirty & /*$$scope*/ 32768) {
    				button_changes.$$scope = { dirty, ctx };
    			}

    			button.$set(button_changes);
    			info.ctx = ctx;

    			if (dirty & /*trafficAccident*/ 256 && promise !== (promise = /*trafficAccident*/ ctx[8]) && handle_promise(promise, info)) ; else {
    				const child_ctx = ctx.slice();
    				child_ctx[8] = info.resolved;
    				info.block.p(child_ctx, dirty);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(button.$$.fragment, local);
    			transition_in(info.block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(button.$$.fragment, local);

    			for (let i = 0; i < 3; i += 1) {
    				const block = info.blocks[i];
    				transition_out(block);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			if (if_block) if_block.d();
    			destroy_component(button);
    			info.block.d();
    			info.token = null;
    			info = null;
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$i.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$i($$self, $$props, $$invalidate) {
    	let { params = {} } = $$props;
    	let trafficAccident = {};
    	let updateProvince = "";
    	let updateYear = 0;
    	let updateTrafficaccidentvictim = 0;
    	let updateDead = 0;
    	let updateInjured = 0;
    	let success = "";
    	let successMsg = "";
    	let errorMsg = "";
    	onMount(getTrafficAccident);

    	async function getTrafficAccident() {
    		const res = await fetch("/api/v2/traffic-accidents/" + params.accidentProcince + "/" + params.accidentYear);
    		console.log("Fetching Traffic Accident...");

    		if (res.ok) {
    			console.log("OK: ");
    			const json = await res.json();
    			$$invalidate(8, trafficAccident = json);
    			$$invalidate(1, updateProvince = trafficAccident.province);
    			$$invalidate(2, updateYear = trafficAccident.year);
    			$$invalidate(3, updateTrafficaccidentvictim = trafficAccident.trafficaccidentvictim);
    			$$invalidate(4, updateDead = trafficAccident.dead);
    			$$invalidate(5, updateInjured = trafficAccident.injured);
    			console.log("Received traffic-accident.");
    		} else {
    			errorMsg = res.status + ": " + res.statusText;
    			console.log("ERROR!" + errorMsg);
    		}
    	}

    	async function updateTrafficAccident() {
    		console.log("Updating Traffic Accident..." + JSON.stringify(params.accidentProcince));

    		const res = await fetch("/api/v2/traffic-accidents/" + params.accidentProcince + "/" + params.accidentYear, {
    			method: "PUT",
    			body: JSON.stringify({
    				province: params.accidentProcince,
    				year: parseInt(params.accidentYear),
    				trafficaccidentvictim: updateTrafficaccidentvictim,
    				dead: updateDead,
    				injured: updateInjured
    			}),
    			headers: { "Content-Type": "application/json" }
    		}).then(function (res) {
    			getTrafficAccident();

    			if (res.ok) {
    				$$invalidate(7, successMsg = res.status + ": " + res.statusText);
    				console.log(successMsg);
    				$$invalidate(6, success = "El dato " + params.accidentProcince + " " + params.accidentYear + " se ha modificado correctamente.");
    			} else if (res.status == 400) {
    				errorMsg = res.status + ": " + res.statusText;
    				window.alert("Error! Todos los campos deben estar rellenos.");
    				console.log(errorMsg);
    			} else if (res.status == 409) {
    				errorMsg = res.status + ": " + res.statusText;
    				window.alert("Error! El dato " + params.accidentProcince + " " + params.accidentYear + " no se ha podido modificar.");
    				console.log(errorMsg);
    			}

    			
    		});
    	}

    	const writable_props = ["params"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console_1$7.warn(`<EditAccidentsTraffics> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("EditAccidentsTraffics", $$slots, []);

    	function input0_input_handler() {
    		updateTrafficaccidentvictim = to_number(this.value);
    		$$invalidate(3, updateTrafficaccidentvictim);
    	}

    	function input1_input_handler() {
    		updateDead = to_number(this.value);
    		$$invalidate(4, updateDead);
    	}

    	function input2_input_handler() {
    		updateInjured = to_number(this.value);
    		$$invalidate(5, updateInjured);
    	}

    	$$self.$set = $$props => {
    		if ("params" in $$props) $$invalidate(0, params = $$props.params);
    	};

    	$$self.$capture_state = () => ({
    		onMount,
    		pop,
    		Table,
    		Button,
    		params,
    		trafficAccident,
    		updateProvince,
    		updateYear,
    		updateTrafficaccidentvictim,
    		updateDead,
    		updateInjured,
    		success,
    		successMsg,
    		errorMsg,
    		getTrafficAccident,
    		updateTrafficAccident
    	});

    	$$self.$inject_state = $$props => {
    		if ("params" in $$props) $$invalidate(0, params = $$props.params);
    		if ("trafficAccident" in $$props) $$invalidate(8, trafficAccident = $$props.trafficAccident);
    		if ("updateProvince" in $$props) $$invalidate(1, updateProvince = $$props.updateProvince);
    		if ("updateYear" in $$props) $$invalidate(2, updateYear = $$props.updateYear);
    		if ("updateTrafficaccidentvictim" in $$props) $$invalidate(3, updateTrafficaccidentvictim = $$props.updateTrafficaccidentvictim);
    		if ("updateDead" in $$props) $$invalidate(4, updateDead = $$props.updateDead);
    		if ("updateInjured" in $$props) $$invalidate(5, updateInjured = $$props.updateInjured);
    		if ("success" in $$props) $$invalidate(6, success = $$props.success);
    		if ("successMsg" in $$props) $$invalidate(7, successMsg = $$props.successMsg);
    		if ("errorMsg" in $$props) errorMsg = $$props.errorMsg;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		params,
    		updateProvince,
    		updateYear,
    		updateTrafficaccidentvictim,
    		updateDead,
    		updateInjured,
    		success,
    		successMsg,
    		trafficAccident,
    		updateTrafficAccident,
    		errorMsg,
    		getTrafficAccident,
    		input0_input_handler,
    		input1_input_handler,
    		input2_input_handler
    	];
    }

    class EditAccidentsTraffics extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$i, create_fragment$i, safe_not_equal, { params: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "EditAccidentsTraffics",
    			options,
    			id: create_fragment$i.name
    		});
    	}

    	get params() {
    		throw new Error("<EditAccidentsTraffics>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set params(value) {
    		throw new Error("<EditAccidentsTraffics>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\front\accidentsAPI\GraphAccidents.svelte generated by Svelte v3.21.0 */
    const file$g = "src\\front\\accidentsAPI\\GraphAccidents.svelte";

    // (86:4) <Button outline color="secondary" on:click="{pop}">
    function create_default_slot$6(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Volver");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$6.name,
    		type: "slot",
    		source: "(86:4) <Button outline color=\\\"secondary\\\" on:click=\\\"{pop}\\\">",
    		ctx
    	});

    	return block;
    }

    function create_fragment$j(ctx) {
    	let script0;
    	let script0_src_value;
    	let script1;
    	let script1_src_value;
    	let script2;
    	let script2_src_value;
    	let script3;
    	let script3_src_value;
    	let t0;
    	let main;
    	let h3;
    	let t2;
    	let t3;
    	let figure;
    	let div;
    	let t4;
    	let p;
    	let current;
    	let dispose;

    	const button = new Button({
    			props: {
    				outline: true,
    				color: "secondary",
    				$$slots: { default: [create_default_slot$6] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	button.$on("click", pop);

    	const block = {
    		c: function create() {
    			script0 = element("script");
    			script1 = element("script");
    			script2 = element("script");
    			script3 = element("script");
    			t0 = space();
    			main = element("main");
    			h3 = element("h3");
    			h3.textContent = "Estadísticas de accidentes de tráfico";
    			t2 = space();
    			create_component(button.$$.fragment);
    			t3 = space();
    			figure = element("figure");
    			div = element("div");
    			t4 = space();
    			p = element("p");
    			p.textContent = "En la gráfica podemos observar el número de: accidentes de tráfico con víctimas, fallecidos y heridos en accidentes de tráfico.";
    			if (script0.src !== (script0_src_value = "https://code.highcharts.com/highcharts.js")) attr_dev(script0, "src", script0_src_value);
    			add_location(script0, file$g, 75, 4, 2236);
    			if (script1.src !== (script1_src_value = "https://code.highcharts.com/modules/exporting.js")) attr_dev(script1, "src", script1_src_value);
    			add_location(script1, file$g, 76, 4, 2307);
    			if (script2.src !== (script2_src_value = "https://code.highcharts.com/modules/export-data.js")) attr_dev(script2, "src", script2_src_value);
    			add_location(script2, file$g, 77, 4, 2385);
    			if (script3.src !== (script3_src_value = "https://code.highcharts.com/modules/accessibility.js")) attr_dev(script3, "src", script3_src_value);
    			add_location(script3, file$g, 78, 4, 2465);
    			add_location(h3, file$g, 83, 4, 2597);
    			attr_dev(div, "id", "container");
    			attr_dev(div, "class", "svelte-1s35res");
    			add_location(div, file$g, 88, 8, 2769);
    			attr_dev(p, "class", "highcharts-description");
    			add_location(p, file$g, 89, 8, 2805);
    			attr_dev(figure, "class", "highcharts-figure svelte-1s35res");
    			add_location(figure, file$g, 87, 4, 2725);
    			add_location(main, file$g, 81, 0, 2583);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor, remount) {
    			append_dev(document.head, script0);
    			append_dev(document.head, script1);
    			append_dev(document.head, script2);
    			append_dev(document.head, script3);
    			insert_dev(target, t0, anchor);
    			insert_dev(target, main, anchor);
    			append_dev(main, h3);
    			append_dev(main, t2);
    			mount_component(button, main, null);
    			append_dev(main, t3);
    			append_dev(main, figure);
    			append_dev(figure, div);
    			append_dev(figure, t4);
    			append_dev(figure, p);
    			current = true;
    			if (remount) dispose();
    			dispose = listen_dev(script3, "load", loadGraph, false, false, false);
    		},
    		p: function update(ctx, [dirty]) {
    			const button_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				button_changes.$$scope = { dirty, ctx };
    			}

    			button.$set(button_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(button.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(button.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			detach_dev(script0);
    			detach_dev(script1);
    			detach_dev(script2);
    			detach_dev(script3);
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(main);
    			destroy_component(button);
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$j.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    async function loadGraph() {
    	let MyData = [];
    	let MyDataGraph = [];
    	const resData = await fetch("/api/v2/traffic-accidents");
    	MyData = await resData.json();

    	MyData.forEach(x => {
    		MyDataGraph.push({
    			name: x.province + " " + x.year,
    			data: [parseInt(x.trafficaccidentvictim), parseInt(x.dead), parseInt(x.injured)]
    		});
    	});

    	Highcharts.chart("container", {
    		chart: { type: "column" },
    		title: { text: "Accidentes de Tráfico" },
    		subtitle: {
    			text: "Estadísticas de los accidentes de tráfico 2015"
    		},
    		xAxis: {
    			categories: ["Accidentes con víctimas", "Fallecidos", "Heridos"],
    			crosshair: true
    		},
    		yAxis: { title: { text: "Números" } },
    		tooltip: {
    			headerFormat: "<span style=\"font-size:10px\">{point.key}</span><table>",
    			pointFormat: "<tr><td style=\"color:{series.color};padding:0\">{series.name}: </td>" + "<td style=\"padding:0\"><b>{point.y}</b></td></tr>",
    			footerFormat: "</table>",
    			shared: true,
    			useHTML: true
    		},
    		plotOptions: {
    			column: { pointPadding: 0.2, borderWidth: 0 }
    		},
    		series: MyDataGraph,
    		responsive: {
    			condition: { maxWidth: 500 },
    			chartOptions: {
    				legend: {
    					layout: "horizontal",
    					align: "center",
    					verticalAlign: "bottom"
    				}
    			}
    		}
    	});
    }

    function instance$j($$self, $$props, $$invalidate) {
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<GraphAccidents> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("GraphAccidents", $$slots, []);
    	$$self.$capture_state = () => ({ pop, Button, loadGraph });
    	return [];
    }

    class GraphAccidents extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$j, create_fragment$j, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "GraphAccidents",
    			options,
    			id: create_fragment$j.name
    		});
    	}
    }

    /* src\front\accidentsAPI\GraphAccidentsV2.svelte generated by Svelte v3.21.0 */
    const file$h = "src\\front\\accidentsAPI\\GraphAccidentsV2.svelte";

    // (62:4) <Button outline color="secondary" on:click="{pop}">
    function create_default_slot$7(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Volver");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$7.name,
    		type: "slot",
    		source: "(62:4) <Button outline color=\\\"secondary\\\" on:click=\\\"{pop}\\\">",
    		ctx
    	});

    	return block;
    }

    function create_fragment$k(ctx) {
    	let script0;
    	let script0_src_value;
    	let script1;
    	let script1_src_value;
    	let script2;
    	let script2_src_value;
    	let t0;
    	let main;
    	let h3;
    	let t2;
    	let t3;
    	let div;
    	let current;
    	let dispose;

    	const button = new Button({
    			props: {
    				outline: true,
    				color: "secondary",
    				$$slots: { default: [create_default_slot$7] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	button.$on("click", pop);

    	const block = {
    		c: function create() {
    			script0 = element("script");
    			script1 = element("script");
    			script2 = element("script");
    			t0 = space();
    			main = element("main");
    			h3 = element("h3");
    			h3.textContent = "Número de accidentes de trafico por provincias en 2018";
    			t2 = space();
    			create_component(button.$$.fragment);
    			t3 = space();
    			div = element("div");
    			if (script0.src !== (script0_src_value = "https://code.jscharting.com/latest/jscharting.js")) attr_dev(script0, "src", script0_src_value);
    			add_location(script0, file$h, 52, 4, 1263);
    			if (script1.src !== (script1_src_value = "https://code.jscharting.com/latest/modules/toolbar.js")) attr_dev(script1, "src", script1_src_value);
    			add_location(script1, file$h, 53, 4, 1341);
    			if (script2.src !== (script2_src_value = "https://code.jscharting.com/latest/modules/maps.js")) attr_dev(script2, "src", script2_src_value);
    			add_location(script2, file$h, 54, 4, 1424);
    			add_location(h3, file$h, 59, 4, 1554);
    			attr_dev(div, "id", "chartDiv");
    			set_style(div, "max-width", "740px");
    			set_style(div, "height", "400px");
    			set_style(div, "margin", "0px auto");
    			add_location(div, file$h, 63, 4, 1699);
    			add_location(main, file$h, 57, 0, 1540);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor, remount) {
    			append_dev(document.head, script0);
    			append_dev(document.head, script1);
    			append_dev(document.head, script2);
    			insert_dev(target, t0, anchor);
    			insert_dev(target, main, anchor);
    			append_dev(main, h3);
    			append_dev(main, t2);
    			mount_component(button, main, null);
    			append_dev(main, t3);
    			append_dev(main, div);
    			current = true;
    			if (remount) dispose();
    			dispose = listen_dev(script2, "load", loadGraph$1, false, false, false);
    		},
    		p: function update(ctx, [dirty]) {
    			const button_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				button_changes.$$scope = { dirty, ctx };
    			}

    			button.$set(button_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(button.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(button.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			detach_dev(script0);
    			detach_dev(script1);
    			detach_dev(script2);
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(main);
    			destroy_component(button);
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$k.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function loadData() {
    	return "Jose";
    }

    async function loadGraph$1() {
    	let MyData = [];
    	let MyDataGraph = [];
    	const resData = await fetch("/api/v2/traffic-accidents");
    	MyData = await resData.json();

    	MyData.forEach(x => {
    		if (x.year == 2018) {
    			MyDataGraph.push(parseInt(x.trafficaccidentvictim));
    		}
    	});

    	var borderingProvinces = "AN.AM, AN.CD, AN.CO, AN.GD, AN.HL, AN.JA, AN.SV, AN.MG";

    	var chart = JSC.chart("chartDiv", {
    		debug: true,
    		chartArea_fill: "#DBDBDB",
    		type: "map",
    		toolbar_visible: true,
    		legend_visible: false,
    		title_label_text: "",
    		defaultPoint_tooltip: "%name (" + loadData() + ")",
    		series: [
    			{
    				name: "Bordering US",
    				color: "#578EE0",
    				points: borderingProvinces.split(", ").map(function (id) {
    					return { map: "ES." + id };
    				})
    			}
    		]
    	});
    }

    function instance$k($$self, $$props, $$invalidate) {
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<GraphAccidentsV2> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("GraphAccidentsV2", $$slots, []);

    	$$self.$capture_state = () => ({
    		onMount,
    		pop,
    		Button,
    		loadData,
    		loadGraph: loadGraph$1
    	});

    	return [];
    }

    class GraphAccidentsV2 extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$k, create_fragment$k, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "GraphAccidentsV2",
    			options,
    			id: create_fragment$k.name
    		});
    	}
    }

    /* src\front\App.svelte generated by Svelte v3.21.0 */
    const file$i = "src\\front\\App.svelte";

    function create_fragment$l(ctx) {
    	let main;
    	let current;

    	const router = new Router({
    			props: { routes: /*routes*/ ctx[0] },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			main = element("main");
    			create_component(router.$$.fragment);
    			add_location(main, file$i, 38, 0, 1467);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			mount_component(router, main, null);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(router.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(router.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			destroy_component(router);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$l.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$l($$self, $$props, $$invalidate) {
    	const routes = {
    		"/": Home,
    		"/analytics": Analytics,
    		"/integrations": Integrations,
    		"/evolution-of-cycling-routes": CyclingRoutesTable,
    		"/evolution-of-cycling-routes/:province/:year": EditCyclingRoute,
    		"/rural-tourism-stats": TourismTable_svelte,
    		"/rural-tourism-stats/:tourismProvince/:tourismYear": EditTourism_svelte,
    		"/traffic-accidents": AccidentsTrafficsTable,
    		"/traffic-accidents/:accidentProcince/:accidentYear": EditAccidentsTraffics,
    		"/traffic-accidents/graph": GraphAccidents,
    		"/traffic-accidents/graph-v2": GraphAccidentsV2,
    		"*": NotFound
    	};

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<App> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("App", $$slots, []);

    	$$self.$capture_state = () => ({
    		Router,
    		NotFound,
    		Home,
    		Integrations,
    		Analytics,
    		CyclingRoutesTable,
    		EditCyclingRoute,
    		TourismTable: TourismTable_svelte,
    		EditTourism: EditTourism_svelte,
    		AccidentsTrafficsTable,
    		EditAccidentsTraffics,
    		GraphAccidents,
    		GraphAccidentsV2,
    		routes
    	});

    	return [routes];
    }

    class App extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$l, create_fragment$l, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "App",
    			options,
    			id: create_fragment$l.name
    		});
    	}
    }

    const app = new App({
    	target: document.querySelector('#SvelteApp')
    });

    return app;

}());
//# sourceMappingURL=bundle.js.map
