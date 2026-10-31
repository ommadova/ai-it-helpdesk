import pandas as pd

data = pd.read_csv("dataset/tickets.csv")

# Clean column names
data.columns = data.columns.str.strip().str.lower()

print("Columns:")
print(data.columns.tolist())

print("\nTotal tickets:")
print(len(data))

print("\nTickets per category:")
print(data["category"].value_counts())

print("\nMissing values:")
print(data.isnull().sum())

print("\nDuplicate rows:")
print(data.duplicated().sum())