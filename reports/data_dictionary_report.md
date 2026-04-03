# Data Overview & Dictionary Report

This report summarizes the data structure for the NYC Yellow Taxi dataset, based on the `references/data_dictionary_trip_records_yellow.pdf`.

## Raw Files Available (`data/raw/`)
The raw data spans over two years of trip records.
- **2024:** Jan - Dec (`yellow_tripdata_2024-01.parquet` to `2024-12.parquet`)
- **2025:** Jan - Dec (`yellow_tripdata_2025-01.parquet` to `2025-12.parquet`)
- **2026:** Jan - Feb (`yellow_tripdata_2026-01.parquet` to `2026-02.parquet`)

## Key Time Series Variables
- **tpep_pickup_datetime:** The date and time when the meter was engaged. (Crucial for time aggregation).
- **tpep_dropoff_datetime:** The date and time when the meter was disengaged.

## Key Spatial Variables
- **PULocationID:** TLC Taxi Zone in which the taximeter was engaged.
- **DOLocationID:** TLC Taxi Zone in which the taximeter was disengaged.

## Fares and Extra Information
- **VendorID:** A code indicating the TPEP provider that provided the record. (1= Creative Mobile Technologies, LLC; 2= VeriFone Inc.)
- **passenger_count:** The number of passengers in the vehicle.
- **trip_distance:** The elapsed trip distance in miles reported by the taximeter.
- **RatecodeID:** The final rate code in effect at the end of the trip.
- **store_and_fwd_flag:** This flag indicates whether the trip record was held in vehicle memory before sending to the vendor, a.k.a. “store and forward,” because the vehicle did not have a connection to the server (Y/N).
- **payment_type:** A numeric code signifying how the passenger paid for the trip.
- **fare_amount:** The time-and-distance fare calculated by the meter.
- **extra:** Miscellaneous extras and surcharges.
- **mta_tax:** $0.50 MTA tax that is automatically triggered based on the metered rate in use.
- **tip_amount:** Tip amount (Populated for credit card tips. Cash tips are not included).
- **tolls_amount:** Total amount of all tolls paid in trip.
- **improvement_surcharge:** $0.30 improvement surcharge assessed trips at the flag drop.
- **total_amount:** The total amount charged to passengers. Does not include cash tips.
- **congestion_surcharge:** Congestion surcharge added for trips going through the congestion zone.
- **Airport_fee:** $1.25 for pick up only at LaGuardia and John F. Kennedy Airports.

## Data Cleaning Notes
1. Filter out trips with invalid timestamps (e.g., years outside the 2024-2026 scope).
2. Drop records where `trip_distance` <= 0 or `total_amount` <= 0.
3. Impute or drop missing `PULocationID` or `DOLocationID` records.
