
//
// Copyright © 2017-present Kary Foundation, Inc. All rights reserved.
//   Author: Pouya Kary <k@karyfoundation.org>
//
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.
//

/// <reference path="../../printer/error.ts" />

namespace KaryScript.CLI.Builder.TaskRunner {

    //
    // ─── COMPILE WITH SETTINGS ──────────────────────────────────────────────────────
    //

        export function BuildSingleFile ( file: string,
                                      settings: Settings.IBuildSettings ) {
            try {
                // reading the file
                const fileString = fs.readFileSync( file, 'utf8' )

                // out file GetNewAddress
                const outFileAddress = GetNewAddress( settings, file )

                // dam darararam! this is the very big moment!
                let compiledCode = KaryScript.Compiler.Compile( fileString, file )

                // a simple directory existence check
                EnsureDirExists( path.dirname( outFileAddress ) )

                // applying source map
                const codeAfterHandlingSourceMap =
                    HandleSourceMap( outFileAddress, settings, compiledCode )

                // saving the file
                fs.writeFileSync( outFileAddress, codeAfterHandlingSourceMap )

            } catch ( e ) {
                Printer.PrintErrors( e )
            }
        }
    
    //
    // ─── APPLY SOURCE MAP ───────────────────────────────────────────────────────────
    //

        function HandleSourceMap ( filePath: string,
                                   settings: Settings.IBuildSettings,
                                       code: SourceMap.CodeWithSourceMap ): string {

            // if no sourcemap is needed
            if (! settings.sourceMap ) return code.code

            // path to HandleSourceMap
            const mapPath = filePath.replace(/\.js$/, '.map.js')

            // fixing the sourceMap path
            let mapObject = JSON.parse( code.map.toString( ) )
            mapObject['sources'][ 0 ] = path.relative(
                mapPath, mapObject['sources'][ 0 ] ).substring( 3 )


            // applying the mapß
            fs.writeFileSync( mapPath, JSON.stringify( mapObject) )


            // so now that we have source map let's map!
            return `${ code.code }\n//# sourceMappingURL=${ path.basename( mapPath ) }`
        }

    //
    // ─── GET NEW ADDRESS ────────────────────────────────────────────────────────────
    //

        function GetNewAddress ( settings: Settings.IBuildSettings,
                                 fileName: string ) {
            return fileName
                    .replace( settings.sourceRoot, settings.binRoot )
                    .replace( /\.k$/, '.js' )
        }

    //
    // ─── MAKE DIR P ─────────────────────────────────────────────────────────────────
    //

        function EnsureDirExists ( address ) {
            const dirname = path.dirname( address )
            if ( !fs.existsSync( dirname ) ) {
                fs.mkdirSync( address )
                EnsureDirExists( dirname )
            }
        }

    // ────────────────────────────────────────────────────────────────────────────────

}