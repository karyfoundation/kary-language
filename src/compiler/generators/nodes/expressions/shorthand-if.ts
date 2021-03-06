
//
// Copyright © 2017-present Kary Foundation, Inc. All rights reserved.
//   Author: Pouya Kary <k@karyfoundation.org>
//
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.
//

/// <reference path="../../switcher.ts" />
/// <reference path="../../../interfaces/envinfo.ts" />

namespace KaryScript.Compiler.Nodes.ShorthandIf {

    //
    // ─── COMPILE IF ─────────────────────────────────────────────────────────────────
    //

        export function Compile ( node: AST.IShorthandIfExpression,
                                   env: IEnv ): SourceMap.SourceNode {

            return env.GenerateSourceNode( node, [
                '(', Nodes.CompileSingleNode( node.predicate, env ), ")? ",
                Nodes.CompileSingleNode( node.trueExpression, env ), " : ",
                Nodes.CompileSingleNode( node.falseExpression, env )
            ])
        }

    // ────────────────────────────────────────────────────────────────────────────────

}