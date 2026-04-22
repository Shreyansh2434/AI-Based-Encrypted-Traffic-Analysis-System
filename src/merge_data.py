import pandas as pd
import glob

def merge_csvs(input_folder, output_file):
    files = glob.glob(f"{input_folder}/*.csv")
    
    dfs = []
    for file in files:
        try:
            df = pd.read_csv(file)
            dfs.append(df)
            print("Loaded:", file)
        except:
            print("Skipped:", file)

    combined = pd.concat(dfs, ignore_index=True)
    combined.to_csv(output_file, index=False)

    print("Merged dataset saved to:", output_file)


if __name__ == "__main__":
    merge_csvs("data", "data/merged.csv")