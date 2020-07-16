import { IHTMLRepresentation, IChange, IElementChange, IComapreService } from "../interfaces/interfaces";

export class CompareService implements IComapreService {
    compareAttributes(firstEl: IHTMLRepresentation, secondEl: IHTMLRepresentation) {
        const firstAttrs = firstEl.attributes;
        const secondAttrs = secondEl.attributes;
        let changes: IChange[] = [];

        firstAttrs.forEach(currAttr => {
            const findedAttr = secondAttrs.find(attr => attr.name === currAttr.name);
            if (findedAttr && findedAttr.value !== currAttr.value) {
                if (currAttr.name === 'key') {
                    changes = [...changes, { name: 'replacedElement', value: secondEl }]
                } else {
                    changes = [...changes, { name: 'editAttribute', value: findedAttr }];
                }
            }
        })

        return changes;
    }

    compareTags(first: IHTMLRepresentation, second: IHTMLRepresentation) {
        return first.tag !== second.tag ? [{ name: 'replacedElement', value: second }] : [];
    }

    compareContent(firstEl: IHTMLRepresentation, secondEl: IHTMLRepresentation) {
        return firstEl.content !== secondEl.content ? [{ name: 'replacedName', value: secondEl.content }] : [];
    }

    compareChildrens(oldState: IHTMLRepresentation[], newState: IHTMLRepresentation[]) {
        let childrens = this.compareStates(oldState, newState);
        return childrens.length > 0 ? [{ name: 'loopChanges', value: childrens }] : [];
    }

    compareTwoElements(firstEl: IHTMLRepresentation, secondEl: IHTMLRepresentation, stateLenght: string) {
        let changes: IChange[] = [];
        let elements = {
            first: firstEl,
            second: secondEl
        }

        if (stateLenght === 'oldState') {
            elements = {
                first: secondEl,
                second: firstEl
            }
        }

        if (!elements.first && !!elements.second && (stateLenght === 'newState' || stateLenght === "equal")) {
            changes = [...changes, { name: 'addElement', value: elements.second }];
            return changes;
        }

        if (!!elements.first && !elements.second && stateLenght === 'oldState') {
            const key = elements.first.attributes.find(attr => attr.name === 'key')
            changes = [...changes, { name: 'removeElement', value: key }];
            return changes;
        }

        if (!!elements.first && !!elements.second) {
            const tags = this.compareTags(elements.first, elements.second)
            changes = [...changes, ...tags];
            if (tags.length > 0) { return changes; }
        }

        if (!!elements.first && !!elements.second) {
            changes = [
                ...changes,
                ...this.compareAttributes(elements.first, elements.second),
                ...this.compareContent(elements.first, elements.second),
                ...this.compareChildrens(elements.first.childrens, elements.second.childrens)
            ];
            return changes;
        }

        return changes;
    }

    compareLength(oldState: IHTMLRepresentation[], newState: IHTMLRepresentation[]) {
        let state = {
            length: 'newState',
            shorter: oldState,
            longer: newState
        }

        if (oldState.length > newState.length) {
            state.length = 'oldState';
            state.shorter = newState;
            state.longer = oldState;
        } else {
            state.length = 'equal';
        }
        return state;
    }

    compareStates(oldState: IHTMLRepresentation[], newState: IHTMLRepresentation[]) {
        let changes: IElementChange[] = [];
        let state = this.compareLength(oldState, newState);

        state.longer.forEach((el, i) => {
            const revEl = state.shorter[i];
            let change: IElementChange = { index: i, changes: this.compareTwoElements(revEl, el, state.length) };
            if (change.changes.length > 0) { changes = [...changes, change]; }
        })

        return changes;
    }
}
