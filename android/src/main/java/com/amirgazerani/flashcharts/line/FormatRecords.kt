package com.amirgazerani.flashcharts.line

import expo.modules.kotlin.records.Field
import expo.modules.kotlin.records.Record
import expo.modules.kotlin.types.Enumerable

enum class FormatType(val value: String) : Enumerable {
    NUMBER("number"),
    DATE("date"),
    LABELS("labels")
}

// One flat Record for all three formats. Each formatter reads only the fields it needs.
class FormatRecord : Record {
    @Field val type: FormatType? = null
    @Field val decimals: Int? = null
    @Field val prefix: String? = null
    @Field val suffix: String? = null
    @Field val pattern: String? = null
    @Field val values: List<String>? = null
}