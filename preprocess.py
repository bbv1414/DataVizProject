import pandas as pd
import json

df2015 = pd.read_csv("data/2015.csv")
df2016 = pd.read_csv("data/2016.csv")
df2017 = pd.read_csv("data/2017.csv")
df2018 = pd.read_csv("data/2018.csv")
df2019 = pd.read_csv("data/2019.csv")

# print(df2015.columns)
# print("//////////////////////////")
# print(df2016.columns)
# print("//////////////////////////")
# print(df2017.columns)
# print("//////////////////////////")
# print(df2018.columns)
# print("//////////////////////////")
# print(df2019.columns)
# print("//////////////////////////")

df = pd.DataFrame(columns=["rank", "score", "country", "year", "economy", "social_support", "health", "freedom", "trust", "generosity"])
df2 = df.copy()
df3 = df.copy()
df4 = df.copy()
df5 = df.copy()
# print(df.columns)
# print(df2.columns)
# print(df3.columns)
# print(df4.columns)
# print(df5.columns)

df["rank"] = df2015["Happiness Rank"]
df["score"] = df2015["Happiness Score"]
df["country"] = df2015["Country"]
df["economy"] = df2015["Economy (GDP per Capita)"]
df["social_support"] = df2015["Family"]
df["health"] = df2015["Health (Life Expectancy)"]
df["freedom"] = df2015["Freedom"]
df["trust"] = df2015["Trust (Government Corruption)"]
df["generosity"] = df2015["Generosity"]
df["year"] = "2015"

for column in ["score", "economy", "social_support", "health", "freedom", "trust", "generosity"]:
    df[column] = ((df[column]-df[column].min())/(df[column].max()-df[column].min())) * 10

df2["rank"] = df2016["Happiness Rank"]
df2["score"] = df2016["Happiness Score"]
df2["country"] = df2016["Country"]
df2["economy"] = df2016["Economy (GDP per Capita)"]
df2["social_support"] = df2016["Family"]
df2["health"] = df2016["Health (Life Expectancy)"]
df2["freedom"] = df2016["Freedom"]
df2["trust"] = df2016["Trust (Government Corruption)"]
df2["generosity"] = df2016["Generosity"]
df2["year"] = "2016"

for column in ["score", "economy", "social_support", "health", "freedom", "trust", "generosity"]:
    df2[column] = ((df2[column]-df2[column].min())/(df2[column].max()-df2[column].min())) * 10

df3["rank"] = df2017["Happiness.Rank"]
df3["score"] = df2017["Happiness.Score"]
df3["country"] = df2017["Country"]
df3["economy"] = df2017["Economy..GDP.per.Capita."]
df3["social_support"] = df2017["Family"]
df3["health"] = df2017["Health..Life.Expectancy."]
df3["freedom"] = df2017["Freedom"]
df3["trust"] = df2017["Trust..Government.Corruption."]
df3["generosity"] = df2017["Generosity"]
df3["year"] = "2017"

for column in ["score", "economy", "social_support", "health", "freedom", "trust", "generosity"]:
    df3[column] = ((df3[column]-df3[column].min())/(df3[column].max()-df3[column].min())) * 10

df4["rank"] = df2018["Overall rank"]
df4["score"] = df2018["Score"]
df4["country"] = df2018["Country or region"]
df4["economy"] = df2018["GDP per capita"]
df4["social_support"] = df2018["Social support"]
df4["health"] = df2018["Healthy life expectancy"]
df4["freedom"] = df2018["Freedom to make life choices"]
df4["trust"] = df2018["Perceptions of corruption"]
df4["generosity"] = df2018["Generosity"]
df4["year"] = "2018"

for column in ["score", "economy", "social_support", "health", "freedom", "trust", "generosity"]:
    df4[column] = ((df4[column]-df4[column].min())/(df4[column].max()-df4[column].min())) * 10

df5["rank"] = df2019["Overall rank"]
df5["score"] = df2019["Score"]
df5["country"] = df2019["Country or region"]
df5["economy"] = df2019["GDP per capita"]
df5["social_support"] = df2019["Social support"]
df5["health"] = df2019["Healthy life expectancy"]
df5["freedom"] = df2019["Freedom to make life choices"]
df5["trust"] = df2019["Perceptions of corruption"]
df5["generosity"] = df2019["Generosity"]
df5["year"] = "2019"

for column in ["score", "economy", "social_support", "health", "freedom", "trust", "generosity"]:
    df5[column] = ((df5[column]-df5[column].min())/(df5[column].max()-df5[column].min())) * 10

# print("//////////////////////////")
# print(df.head(5))
# print("//////////////////////////")
# print(df2.head(5))
# print("//////////////////////////")

finaldf = df.append(df2, ignore_index=True)
finaldf = finaldf.append(df3, ignore_index=True)
finaldf = finaldf.append(df4, ignore_index=True)
finaldf = finaldf.append(df5, ignore_index=True)
finaldf = finaldf.set_index(["year", "country"])

print(finaldf.head())
# print("...")
# print(finaldf.tail())

result = finaldf.to_json(orient="index")
parsed = json.loads(result)

with open('happiness_data.json', 'w') as f:
    json.dump(parsed, f)