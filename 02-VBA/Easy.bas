Attribute VB_Name = "Easy"
Sub CalculateStockVolume()

    Dim totalRows As Long
    Dim i As Long
    Dim oldI As Long
    Dim tickerCount As Long
    
    Range("I1") = "Ticker"
    Range("J1") = "Total Stock Volume"
    
    totalRows = Cells(Rows.Count, 1).End(xlUp).Row
    tickerCount = 2
    oldI = 2
    For i = 2 To totalRows
        If Cells(i, 1).Value <> Cells(i + 1, 1).Value Then
            FillStockVolumeTable Cells(i, 1).Value, tickerCount, oldI, i
            tickerCount = tickerCount + 1
            oldI = i + 1
        End If
    Next i
End Sub


Sub FillStockVolumeTable(ticker As String, rowStockVolumeTable As Long, iniRow As Long, endRow As Long)
    
    Dim stokeVolume As Double
    stokeVolume = 0
    
    Range("I" & rowStockVolumeTable).Value = ticker
        
    For i = iniRow To endRow
        If Cells(i, 1).Value = ticker Then 'the if is not necesary since the table is sorted
            stokeVolume = stokeVolume + Cells(i, 7).Value
        End If
    Next i
    Range("J" & rowStockVolumeTable).Value = stokeVolume
    
End Sub

