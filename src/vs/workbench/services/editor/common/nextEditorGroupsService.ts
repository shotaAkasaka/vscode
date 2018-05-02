/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

'use strict';

import { Event } from 'vs/base/common/event';
import { createDecorator, ServiceIdentifier } from 'vs/platform/instantiation/common/instantiation';
import { GroupIdentifier } from 'vs/workbench/common/editor';
import { IEditorInput, IEditor, IEditorOptions } from 'vs/platform/editor/common/editor';

export const INextEditorGroupsService = createDecorator<INextEditorGroupsService>('nextEditorGroupsService');

export enum Direction {
	UP,
	DOWN,
	LEFT,
	RIGHT
}

export interface IMoveEditorOptions {
	index?: number;
	inactive?: boolean;
	preserveFocus?: boolean;
}

export interface INextEditorGroup {

	readonly id: GroupIdentifier;

	readonly activeControl: IEditor;
	readonly activeEditor: IEditorInput;

	readonly isActive: boolean;

	/**
	 * Open an editor in this group. The returned promise is resolved when the
	 * editor has finished loading.
	 */
	openEditor(editor: IEditorInput, options?: IEditorOptions): Thenable<void>;

	/**
	 * Find out if the provided editor is opened in the group. An editor can be opened
	 * but not actively visible.
	 */
	isOpened(editor: IEditorInput): boolean;

	/**
	 * Move an editor from this group either within this group or to another group.
	 */
	moveEditor(editor: IEditorInput, target: INextEditorGroup, options?: IMoveEditorOptions): void;

	/**
	 * Close an editor from the group. This may trigger a confirmation dialog if
	 * the editor is dirty and thus returns a promise as value.
	 *
	 * @param editor the editor to close, or the currently active editor
	 * if unspecified.
	 *
	 * @returns a promise when the editor is closed.
	 */
	closeEditor(editor?: IEditorInput): Thenable<void>;

	/**
	 * Set an editor to be pinned. A pinned editor is not replaced
	 * when another editor opens at the same location.
	 *
	 * @param editor the editor to pin, or the currently active editor
	 * if unspecified.
	 */
	pinEditor(editor?: IEditorInput): void;

	/**
	 * Move keyboard focus into the group.
	 */
	focus(): void;
}

export interface IAddGroupOptions {
	copyGroup?: boolean;
	copyEditor?: boolean;
}

export interface INextEditorGroupsService {

	_serviceBrand: ServiceIdentifier<any>;

	readonly onDidActiveGroupChange: Event<INextEditorGroup>;

	readonly activeGroup: INextEditorGroup;
	readonly groups: INextEditorGroup[];

	getGroups(sortByMostRecentlyActive?: boolean): INextEditorGroup[];
	getGroup(identifier: GroupIdentifier): INextEditorGroup;

	focusGroup(group: INextEditorGroup | GroupIdentifier): INextEditorGroup;
	activateGroup(group: INextEditorGroup | GroupIdentifier): INextEditorGroup;

	addGroup(fromGroup: INextEditorGroup | GroupIdentifier, direction: Direction, options?: IAddGroupOptions): INextEditorGroup;
	removeGroup(group: INextEditorGroup | GroupIdentifier): void;
}