Attribute VB_Name = "Moderate_Hard"
Sub Main()
    Dim ws As Worksheet

    For Each ws In Worksheets
        ws.Activate
            CalculateStockChanges
    Next ws
    
End Sub

Sub CalculateStockChanges()

    Dim totalRows As Long
    Dim i As Long
    Dim oldI As Long
    Dim tickerCount As Long
    
    Range("I1") = "Ticker"
    Range("J1") = "Yearly Change"
    Range("K1") = "Percent Change"
    Range("L1") = "Total Stock Volume"
    
    totalRows = Cells(Rows.Count, 1).End(xlUp).Row
    tickerCount = 2
    oldI = 2
    
    For i = 2 To totalRows
        If Cells(i, 1).Value <> Cells(i + 1, 1).Value Then
            FillStockChangesTable Cells(i, 1).Value, tickerCount, oldI, i
            tickerCount = tickerCount + 1
            oldI = i + 1
        End If
    Next i
    
    Range("P1") = "Ticker"
    Range("Q1") = "Value"
    
    GetPercentIncrease
    GetPercentDecrease
    GetGreatestTotalVolume
End Sub


Sub FillStockChangesTable(ticker As String, rowStockVolumeTable As Long, iniRow As Long, endRow As Long)
    
    Dim stokeVolume As Double
    Dim yearlyChange As Double
    Dim percentChange As Double
    stokeVolume = 0
    
    Range("I" & rowStockVolumeTable).Value = ticker
    yearlyChange = Range("F" & endRow).Value - Range("C" & iniRow).Value
    Range("J" & rowStockVolumeTable).Value = yearlyChange
    If yearlyChange >= 0 Then
            Range("J" & rowStockVolumeTable).Interior.ColorIndex = 4
        Else
            Range("J" & rowStockVolumeTable).Interior.ColorIndex = 3
        End If

    If Range("C" & iniRow).Value <> 0 Then
        percentChange = yearlyChange / Range("C" & iniRow).Value
        Range("K" & rowStockVolumeTable).Value = Format(percentChange, "Percent")
    Else
        Range("K" & rowStockVolumeTable).Value = Format(0, "Percent")
    End If
    
    For i = iniRow To endRow
        If Cells(i, 1).Value = ticker Then 'the if is not necesary since the table is sorted
            stokeVolume = stokeVolume + Cells(i, 7).Value
        End If
    Next i
    Range("L" & rowStockVolumeTable).Value = stokeVolume
    
End Sub


Sub GetPercentIncrease()
    Dim totalRows As Long
    Dim i As Long
    Dim MaxValue As Double
    Dim MaxTicker As String
    
    Range("O2") = "Greatest % Increase"
    totalRows = Cells(Rows.Count, 11).End(xlUp).Row
    
    MaxValue = Range("K2").Value
    For i = 2 To totalRows
        If Range("K" & i).Value >= MaxValue Then
            MaxValue = Range("K" & i).Value
            MaxTicker = Range("I" & i).Value
        End If
    Next i
    
    Range("P2").Value = MaxTicker
    Range("Q2").Value = Format(MaxValue, "Percent")
End Sub

Sub GetPercentDecrease()
    Dim totalRows As Long
    Dim i As Long
    Dim MinValue As Double
    Dim MInTicker As String
    
    Range("O3") = "Greatest % Decrease"
    totalRows = Cells(Rows.Count, 11).End(xlUp).Row
    
    MinValue = Range("K2").Value
    For i = 2 To totalRows
        If Range("K" & i).Value <= MinValue Then
            MinValue = Range("K" & i).Value
            MInTicker = Range("I" & i).Value
        End If
    Next i
    
    Range("P3").Value = MInTicker
    Range("Q3").Value = Format(MinValue, "Percent")
End Sub

Sub GetGreatestTotalVolume()
    Dim totalRows As Long
    Dim i As Long
    Dim MaxValue As Double
    Dim MaxTicker As String
    
    Range("O4") = "Greatest Total Volume"
    totalRows = Cells(Rows.Count, 11).End(xlUp).Row
    
    MaxValue = Range("L2").Value
    For i = 2 To totalRows
        If Range("L" & i).Value >= MaxValue Then
            MaxValue = Range("L" & i).Value
            MaxTicker = Range("I" & i).Value
        End If
    Next i
    
    Range("P4").Value = MaxTicker
    Range("Q4").Value = MaxValue
End Sub
