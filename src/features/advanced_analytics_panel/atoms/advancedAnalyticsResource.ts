import { createResourceAtom } from '~utils/atoms';
import { apiClient } from '~core/index';
import { focusedGeometryAtom } from '~core/shared_state';
import { AdvancedAnalyticsData } from '~core/types';

const json = `[
  {
    "numerator": "covid19_vaccines",
    "denominator": "total_building_count",
    "numeratorLabel": "COVID19 Vaccine Acceptance",
    "denominatorLabel": "Total Buildings Estimate",
    "analytics": [
      {
        "calculation": "sum",
        "value": 0,
        "quality": 0
      },
      {
        "calculation": "min",
        "value": 0,
        "quality": 0
      },
      {
        "calculation": "max",
        "value": 0,
        "quality": 0
      },
      {
        "calculation": "mean",
        "value": 0,
        "quality": 0
      },
      {
        "calculation": "stddev",
        "value": 0,
        "quality": 0
      },
      {
        "calculation": "median",
        "value": 0,
        "quality": 0
      }
    ]
  },
  {
    "numerator": "days_maxtemp_over_32c_1c",
    "denominator": "population",
    "numeratorLabel": "Days above 32C, recent scenario",
    "denominatorLabel": "Population",
    "analytics": [
      {
        "calculation": "sum",
        "value": 122225.7153829674,
        "quality": 11.052946053415885
      },
      {
        "calculation": "min",
        "value": 0.0014521208364406163,
        "quality": 3.5469381206793957
      },
      {
        "calculation": "max",
        "value": 270.67422790979833,
        "quality": 8.606492413534038
      },
      {
        "calculation": "mean",
        "value": 9.19889481319842,
        "quality": 7.230549114075446
      },
      {
        "calculation": "stddev",
        "value": 23.505178255124257,
        "quality": 8.110639022028455
      },
      {
        "calculation": "median",
        "value": 1.0040854494892002,
        "quality": 6.268584134853925
      }
    ]
  },
  {
    "numerator": "days_maxtemp_over_32c_1c",
    "denominator": "total_building_count",
    "numeratorLabel": "Days above 32C, recent scenario",
    "denominatorLabel": "Total Buildings Estimate",
    "analytics": [
      {
        "calculation": "sum",
        "value": 147993.49384942095,
        "quality": 9.872453382852903
      },
      {
        "calculation": "min",
        "value": 0.014779011500228374,
        "quality": 3.571125150428332
      },
      {
        "calculation": "max",
        "value": 271.40780588385394,
        "quality": 7.23266838912117
      },
      {
        "calculation": "mean",
        "value": 11.703716397739893,
        "quality": 6.071564544836461
      },
      {
        "calculation": "stddev",
        "value": 29.554605591859648,
        "quality": 6.545000456560095
      },
      {
        "calculation": "median",
        "value": 2.594569369689529,
        "quality": 5.4173060420322905
      }
    ]
  },
  {
    "numerator": "avgmax_ts",
    "denominator": "one",
    "numeratorLabel": "OSM Last Edit Date (avg)",
    "denominatorLabel": "1",
    "analytics": [
      {
        "calculation": "sum",
        "value": 22547750428736,
        "quality": 3.87257063493304
      },
      {
        "calculation": "min",
        "value": 1263757060,
        "quality": 0.07054424105060181
      },
      {
        "calculation": "max",
        "value": 1643830338,
        "quality": 0.02787896305279083
      },
      {
        "calculation": "mean",
        "value": 1567121936.943008,
        "quality": 0.019330940581208062
      },
      {
        "calculation": "stddev",
        "value": 87883383.99289352,
        "quality": 0.35887824473519414
      },
      {
        "calculation": "median",
        "value": 1625502159,
        "quality": 0.038374983467079606
      }
    ]
  },
  {
    "numerator": "avgmax_ts",
    "denominator": "populated_area_km2",
    "numeratorLabel": "OSM Last Edit Date (avg)",
    "denominatorLabel": "Populated area",
    "analytics": [
      {
        "calculation": "sum",
        "value": 35506395973559.5,
        "quality": 8.67719461699943
      },
      {
        "calculation": "min",
        "value": 2215179915.1768827,
        "quality": 5.2609315589938594
      },
      {
        "calculation": "max",
        "value": 2945986283.9038973,
        "quality": 4.673233363466366
      },
      {
        "calculation": "mean",
        "value": 2755851907.2927275,
        "quality": 4.868173896515756
      },
      {
        "calculation": "stddev",
        "value": 129045427.91210109,
        "quality": 4.46992592324491
      },
      {
        "calculation": "median",
        "value": 2827463240.4368477,
        "quality": 4.87931498798667
      }
    ]
  },
  {
    "numerator": "avgmax_ts",
    "denominator": "area_km2",
    "numeratorLabel": "OSM Last Edit Date (avg)",
    "denominatorLabel": "Area",
    "analytics": [
      {
        "calculation": "sum",
        "value": 39394851919346.14,
        "quality": 10.61563557014504
      },
      {
        "calculation": "min",
        "value": 2178785222.2955985,
        "quality": 6.757784086169517
      },
      {
        "calculation": "max",
        "value": 2945986283.9038973,
        "quality": 6.7103224842600735
      },
      {
        "calculation": "mean",
        "value": 2738035301.594811,
        "quality": 6.758665136662547
      },
      {
        "calculation": "stddev",
        "value": 150568053.0577496,
        "quality": 6.04172655656442
      },
      {
        "calculation": "median",
        "value": 2821258232.81575,
        "quality": 6.7716689328710755
      }
    ]
  },
  {
    "numerator": "avgmax_ts",
    "denominator": "population",
    "numeratorLabel": "OSM Last Edit Date (avg)",
    "denominatorLabel": "Population",
    "analytics": [
      {
        "calculation": "sum",
        "value": 2393013409965.144,
        "quality": 10.416626125023988
      },
      {
        "calculation": "min",
        "value": 60145.81654266626,
        "quality": 3.566671636221982
      },
      {
        "calculation": "max",
        "value": 1643693596,
        "quality": 7.338585611547946
      },
      {
        "calculation": "mean",
        "value": 185735284.84672028,
        "quality": 6.607605404540315
      },
      {
        "calculation": "stddev",
        "value": 418888463.7048171,
        "quality": 7.564707383227746
      },
      {
        "calculation": "median",
        "value": 19444676.333333336,
        "quality": 5.6275117068569065
      }
    ]
  },
  {
    "numerator": "avgmax_ts",
    "denominator": "total_building_count",
    "numeratorLabel": "OSM Last Edit Date (avg)",
    "denominatorLabel": "Total Buildings Estimate",
    "analytics": [
      {
        "calculation": "sum",
        "value": 2493116089425.1646,
        "quality": 9.350469445064439
      },
      {
        "calculation": "min",
        "value": 373631.3832689248,
        "quality": 2.9849101068322645
      },
      {
        "calculation": "max",
        "value": 1643701888,
        "quality": 6.355132202259039
      },
      {
        "calculation": "mean",
        "value": 197427628.24082708,
        "quality": 5.55016486750824
      },
      {
        "calculation": "stddev",
        "value": 370283409.7486209,
        "quality": 6.189173015452161
      },
      {
        "calculation": "median",
        "value": 52791779.21428572,
        "quality": 4.97732323832322
      }
    ]
  },
  {
    "numerator": "days_maxtemp_over_32c_2c",
    "denominator": "populated_area_km2",
    "numeratorLabel": "Days above 32C, potential scenario (2C)",
    "denominatorLabel": "Populated area",
    "analytics": [
      {
        "calculation": "sum",
        "value": 3197053.5297054583,
        "quality": 9.449014427085146
      },
      {
        "calculation": "min",
        "value": 26.290697654102775,
        "quality": 4.718987663315924
      },
      {
        "calculation": "max",
        "value": 546.0890471346852,
        "quality": 5.934622043584615
      },
      {
        "calculation": "mean",
        "value": 240.61515238243834,
        "quality": 5.626617487744706
      },
      {
        "calculation": "stddev",
        "value": 104.14696793571227,
        "quality": 6.045360831001763
      },
      {
        "calculation": "median",
        "value": 225.3887631502422,
        "quality": 5.598226775147948
      }
    ]
  },
  {
    "numerator": "days_maxtemp_over_32c_2c",
    "denominator": "area_km2",
    "numeratorLabel": "Days above 32C, potential scenario (2C)",
    "denominatorLabel": "Area",
    "analytics": [
      {
        "calculation": "sum",
        "value": 4122092.3372556157,
        "quality": 11.225979896073833
      },
      {
        "calculation": "min",
        "value": 22.385417883450053,
        "quality": 6.686239879401854
      },
      {
        "calculation": "max",
        "value": 546.7904186649677,
        "quality": 7.439226584685446
      },
      {
        "calculation": "mean",
        "value": 250.46131591053685,
        "quality": 7.310632833749641
      },
      {
        "calculation": "stddev",
        "value": 115.61985664623171,
        "quality": 7.029484116342453
      },
      {
        "calculation": "median",
        "value": 228.03884876600316,
        "quality": 7.2699010155780215
      }
    ]
  },
  {
    "numerator": "days_maxtemp_over_32c_2c",
    "denominator": "population",
    "numeratorLabel": "Days above 32C, potential scenario (2C)",
    "denominatorLabel": "Population",
    "analytics": [
      {
        "calculation": "sum",
        "value": 192402.7809371401,
        "quality": 11.120477512275967
      },
      {
        "calculation": "min",
        "value": 0.005287300706393072,
        "quality": 3.941181668907845
      },
      {
        "calculation": "max",
        "value": 306.5414989358128,
        "quality": 8.55579151128178
      },
      {
        "calculation": "mean",
        "value": 14.48052840649809,
        "quality": 7.298080572935527
      },
      {
        "calculation": "stddev",
        "value": 34.37129537060915,
        "quality": 8.293850816800918
      },
      {
        "calculation": "median",
        "value": 1.6406584274656106,
        "quality": 6.352314336694033
      }
    ]
  },
  {
    "numerator": "days_maxtemp_over_32c_2c",
    "denominator": "total_building_count",
    "numeratorLabel": "Days above 32C, potential scenario (2C)",
    "denominatorLabel": "Total Buildings Estimate",
    "analytics": [
      {
        "calculation": "sum",
        "value": 221144.5582671831,
        "quality": 9.928969622940809
      },
      {
        "calculation": "min",
        "value": 0.03316433955731027,
        "quality": 3.7551634109180347
      },
      {
        "calculation": "max",
        "value": 307.19818283336105,
        "quality": 7.1817214250760895
      },
      {
        "calculation": "mean",
        "value": 17.488695790208233,
        "quality": 6.128080784924366
      },
      {
        "calculation": "stddev",
        "value": 38.82959319686995,
        "quality": 6.5816699165388775
      },
      {
        "calculation": "median",
        "value": 4.2570161439306435,
        "quality": 5.51442865866846
      }
    ]
  },
  {
    "numerator": "days_maxtemp_over_32c_2c",
    "denominator": "one",
    "numeratorLabel": "Days above 32C, potential scenario (2C)",
    "denominatorLabel": "1",
    "analytics": [
      {
        "calculation": "sum",
        "value": 2348108.025597579,
        "quality": 4.851004677283994
      },
      {
        "calculation": "min",
        "value": 12.689879583280547,
        "quality": 0.8438170303998478
      },
      {
        "calculation": "max",
        "value": 307.8720359427198,
        "quality": 1.174199927392376
      },
      {
        "calculation": "mean",
        "value": 142.67274429442088,
        "quality": 0.9356576149598023
      },
      {
        "calculation": "stddev",
        "value": 64.49972372610858,
        "quality": 1.1203329528610926
      },
      {
        "calculation": "median",
        "value": 130.75793849644418,
        "quality": 0.8977846649931382
      }
    ]
  },
  {
    "numerator": "count",
    "denominator": "area_km2",
    "numeratorLabel": "OSM Objects",
    "denominatorLabel": "Area",
    "analytics": [
      {
        "calculation": "sum",
        "value": 1481252.1699635403,
        "quality": 5.739775783964879
      },
      {
        "calculation": "min",
        "value": 0,
        "quality": 0
      },
      {
        "calculation": "max",
        "value": 8234.819528866736,
        "quality": 3.6928424782043154
      },
      {
        "calculation": "mean",
        "value": 90.00195467028438,
        "quality": 1.8244287216406871
      },
      {
        "calculation": "stddev",
        "value": 290.6195402880757,
        "quality": 2.8050187236426134
      },
      {
        "calculation": "median",
        "value": 35.40994981929367,
        "quality": 1.5326863101501917
      }
    ]
  },
  {
    "numerator": "count",
    "denominator": "populated_area_km2",
    "numeratorLabel": "OSM Objects",
    "denominatorLabel": "Populated area",
    "analytics": [
      {
        "calculation": "sum",
        "value": 1475360.1563649338,
        "quality": 3.9511151785594048
      },
      {
        "calculation": "min",
        "value": 0,
        "quality": 0
      },
      {
        "calculation": "max",
        "value": 8234.819528866736,
        "quality": 1.8672221203852148
      },
      {
        "calculation": "mean",
        "value": 111.03786831978128,
        "quality": 0.22171677373905108
      },
      {
        "calculation": "stddev",
        "value": 319.86497660527715,
        "quality": 0.9557512131408259
      },
      {
        "calculation": "median",
        "value": 54.17491996503249,
        "quality": 0.33748881668356767
      }
    ]
  },
  {
    "numerator": "count",
    "denominator": "population",
    "numeratorLabel": "OSM Objects",
    "denominatorLabel": "Population",
    "analytics": [
      {
        "calculation": "sum",
        "value": 12042.988086725649,
        "quality": 4.766036939256332
      },
      {
        "calculation": "min",
        "value": 0,
        "quality": 0
      },
      {
        "calculation": "max",
        "value": 28,
        "quality": 2.317488171425578
      },
      {
        "calculation": "mean",
        "value": 0.9063737553041055,
        "quality": 0.9978029950937792
      },
      {
        "calculation": "stddev",
        "value": 1.1362481735747718,
        "quality": 1.6153959561630824
      },
      {
        "calculation": "median",
        "value": 0.4222222222222222,
        "quality": 0.7987141098938477
      }
    ]
  },
  {
    "numerator": "count",
    "denominator": "total_building_count",
    "numeratorLabel": "OSM Objects",
    "denominatorLabel": "Total Buildings Estimate",
    "analytics": [
      {
        "calculation": "sum",
        "value": 17437.7028603938,
        "quality": 3.81643593423721
      },
      {
        "calculation": "min",
        "value": 0,
        "quality": 0
      },
      {
        "calculation": "max",
        "value": 168,
        "quality": 2.0502712680985895
      },
      {
        "calculation": "mean",
        "value": 1.3790196014546303,
        "quality": 0.17156990193611804
      },
      {
        "calculation": "stddev",
        "value": 2.672019506154549,
        "quality": 1.3219854878122919
      },
      {
        "calculation": "median",
        "value": 1.0769230769230769,
        "quality": 0.14324934742632983
      }
    ]
  },
  {
    "numerator": "count",
    "denominator": "one",
    "numeratorLabel": "OSM Objects",
    "denominatorLabel": "1",
    "analytics": [
      {
        "calculation": "sum",
        "value": 845821,
        "quality": 1.0483787518921557
      },
      {
        "calculation": "min",
        "value": 0,
        "quality": 0
      },
      {
        "calculation": "max",
        "value": 4656,
        "quality": 3.1664635572298
      },
      {
        "calculation": "mean",
        "value": 51.39269656094301,
        "quality": 4.963725814216348
      },
      {
        "calculation": "stddev",
        "value": 164.4654527716456,
        "quality": 4.257367344216613
      },
      {
        "calculation": "median",
        "value": 20,
        "quality": 5.3735972241498455
      }
    ]
  },
  {
    "numerator": "count_6_months",
    "denominator": "populated_area_km2",
    "numeratorLabel": "OSM Objects (last 6 months)",
    "denominatorLabel": "Populated area",
    "analytics": [
      {
        "calculation": "sum",
        "value": 402374.1737962419,
        "quality": 4.608756653861689
      },
      {
        "calculation": "min",
        "value": 0,
        "quality": 0
      },
      {
        "calculation": "max",
        "value": 1499.0984765586527,
        "quality": 2.287537812171589
      },
      {
        "calculation": "mean",
        "value": 30.283297493508087,
        "quality": 0.7863597145212492
      },
      {
        "calculation": "stddev",
        "value": 65.30418462032529,
        "quality": 1.220491721753956
      },
      {
        "calculation": "median",
        "value": 1.736822337013428,
        "quality": 0.7621698225606992
      }
    ]
  },
  {
    "numerator": "count_6_months",
    "denominator": "area_km2",
    "numeratorLabel": "OSM Objects (last 6 months)",
    "denominatorLabel": "Area",
    "analytics": [
      {
        "calculation": "sum",
        "value": 402803.52964620816,
        "quality": 6.186469166004585
      },
      {
        "calculation": "min",
        "value": 0,
        "quality": 0
      },
      {
        "calculation": "max",
        "value": 1499.0984765586527,
        "quality": 3.7915849234062446
      },
      {
        "calculation": "mean",
        "value": 24.47463419894326,
        "quality": 2.2711221036803932
      },
      {
        "calculation": "stddev",
        "value": 59.87048943743637,
        "quality": 2.5808186384468073
      },
      {
        "calculation": "median",
        "value": 0,
        "quality": 0
      }
    ]
  },
  {
    "numerator": "count_6_months",
    "denominator": "population",
    "numeratorLabel": "OSM Objects (last 6 months)",
    "denominatorLabel": "Population",
    "analytics": [
      {
        "calculation": "sum",
        "value": 4605.865629968985,
        "quality": 5.54923075315441
      },
      {
        "calculation": "min",
        "value": 0,
        "quality": 0
      },
      {
        "calculation": "max",
        "value": 6,
        "quality": 3.0975946586749776
      },
      {
        "calculation": "mean",
        "value": 0.3466445119266188,
        "quality": 1.7268338138139694
      },
      {
        "calculation": "stddev",
        "value": 0.6561551596675634,
        "quality": 2.077484727679412
      },
      {
        "calculation": "median",
        "value": 0.0023752969121140144,
        "quality": 0.8426116617832231
      }
    ]
  },
  {
    "numerator": "count_6_months",
    "denominator": "total_building_count",
    "numeratorLabel": "OSM Objects (last 6 months)",
    "denominatorLabel": "Total Buildings Estimate",
    "analytics": [
      {
        "calculation": "sum",
        "value": 5259.5992425483655,
        "quality": 4.358672952565819
      },
      {
        "calculation": "min",
        "value": 0,
        "quality": 0
      },
      {
        "calculation": "max",
        "value": 13,
        "quality": 1.9019272955828948
      },
      {
        "calculation": "mean",
        "value": 0.41594300059694467,
        "quality": 0.5577841145493769
      },
      {
        "calculation": "stddev",
        "value": 0.5378466295173301,
        "quality": 0.9008118591573435
      },
      {
        "calculation": "median",
        "value": 0.038461538461538464,
        "quality": 0.8032517523284951
      }
    ]
  },
  {
    "numerator": "count_6_months",
    "denominator": "one",
    "numeratorLabel": "OSM Objects (last 6 months)",
    "denominatorLabel": "1",
    "analytics": [
      {
        "calculation": "sum",
        "value": 230863,
        "quality": 0.6543633139848493
      },
      {
        "calculation": "min",
        "value": 0,
        "quality": 0
      },
      {
        "calculation": "max",
        "value": 860,
        "quality": 3.0614117094624413
      },
      {
        "calculation": "mean",
        "value": 14.027403086644792,
        "quality": 4.569710376309041
      },
      {
        "calculation": "stddev",
        "value": 34.27733492332362,
        "quality": 4.287427433202792
      },
      {
        "calculation": "median",
        "value": 0,
        "quality": 0
      }
    ]
  },
  {
    "numerator": "view_count",
    "denominator": "area_km2",
    "numeratorLabel": "OSM Map Views",
    "denominatorLabel": "Area",
    "analytics": [
      {
        "calculation": "sum",
        "value": 319882.51821791066,
        "quality": 4.391601879907812
      },
      {
        "calculation": "min",
        "value": 0,
        "quality": 0
      },
      {
        "calculation": "max",
        "value": 25703.3000515518,
        "quality": 3.4774535236028696
      },
      {
        "calculation": "mean",
        "value": 19.436293487538624,
        "quality": 0.9600367472527058
      },
      {
        "calculation": "stddev",
        "value": 289.6523792322449,
        "quality": 1.9954942876247064
      },
      {
        "calculation": "median",
        "value": 0,
        "quality": 0
      }
    ]
  },
  {
    "numerator": "view_count",
    "denominator": "populated_area_km2",
    "numeratorLabel": "OSM Map Views",
    "denominatorLabel": "Populated area",
    "analytics": [
      {
        "calculation": "sum",
        "value": 264638.0745907101,
        "quality": 3.019184452075521
      },
      {
        "calculation": "min",
        "value": 0,
        "quality": 0
      },
      {
        "calculation": "max",
        "value": 25703.3000515518,
        "quality": 2.1350879155024143
      },
      {
        "calculation": "mean",
        "value": 19.917067403530528,
        "quality": 2.049776366900824
      },
      {
        "calculation": "stddev",
        "value": 317.8493529427223,
        "quality": 1.4697452072931858
      },
      {
        "calculation": "median",
        "value": 0,
        "quality": 0
      }
    ]
  },
  {
    "numerator": "view_count",
    "denominator": "population",
    "numeratorLabel": "OSM Map Views",
    "denominatorLabel": "Population",
    "analytics": [
      {
        "calculation": "sum",
        "value": 1653.8787961459348,
        "quality": 3.9108752623978065
      },
      {
        "calculation": "min",
        "value": 0,
        "quality": 0
      },
      {
        "calculation": "max",
        "value": 438.9375,
        "quality": 3.4935099898181203
      },
      {
        "calculation": "mean",
        "value": 0.12447345496695528,
        "quality": 2.3189637006385064
      },
      {
        "calculation": "stddev",
        "value": 4.840300557370535,
        "quality": 2.356673352131418
      },
      {
        "calculation": "median",
        "value": 0,
        "quality": 0
      }
    ]
  },
  {
    "numerator": "view_count",
    "denominator": "total_building_count",
    "numeratorLabel": "OSM Map Views",
    "denominatorLabel": "Total Buildings Estimate",
    "analytics": [
      {
        "calculation": "sum",
        "value": 9625.14585008418,
        "quality": 3.6135243177901613
      },
      {
        "calculation": "min",
        "value": 0,
        "quality": 0
      },
      {
        "calculation": "max",
        "value": 955.515625,
        "quality": 2.630276685757747
      },
      {
        "calculation": "mean",
        "value": 0.7611819573020309,
        "quality": 2.547803462115967
      },
      {
        "calculation": "stddev",
        "value": 15.773051444327136,
        "quality": 1.9876286193312627
      },
      {
        "calculation": "median",
        "value": 0,
        "quality": 0
      }
    ]
  },
  {
    "numerator": "view_count",
    "denominator": "one",
    "numeratorLabel": "OSM Map Views",
    "denominatorLabel": "1",
    "analytics": [
      {
        "calculation": "sum",
        "value": 180960.515625,
        "quality": 3.4150567281222224
      },
      {
        "calculation": "min",
        "value": 0,
        "quality": 0
      },
      {
        "calculation": "max",
        "value": 14525.71875,
        "quality": 4.488914876482115
      },
      {
        "calculation": "mean",
        "value": 10.99529199325556,
        "quality": 7.330403790446414
      },
      {
        "calculation": "stddev",
        "value": 163.7120355931485,
        "quality": 6.263739360090782
      },
      {
        "calculation": "median",
        "value": 0,
        "quality": 0
      }
    ]
  },
  {
    "numerator": "max_ts",
    "denominator": "one",
    "numeratorLabel": "OSM Last Edit Date (max)",
    "denominatorLabel": "1",
    "analytics": [
      {
        "calculation": "sum",
        "value": 22547750428736,
        "quality": 3.8362138770673724
      },
      {
        "calculation": "min",
        "value": 1263757060,
        "quality": 0.11419636931501972
      },
      {
        "calculation": "max",
        "value": 1643830338,
        "quality": 0.000030002190988575156
      },
      {
        "calculation": "mean",
        "value": 1567121936.943008,
        "quality": 0.020757317825092665
      },
      {
        "calculation": "stddev",
        "value": 87883383.99289352,
        "quality": 5.057792873762741
      },
      {
        "calculation": "median",
        "value": 1625502159,
        "quality": 0.004872557171626441
      }
    ]
  },
  {
    "numerator": "max_ts",
    "denominator": "populated_area_km2",
    "numeratorLabel": "OSM Last Edit Date (max)",
    "denominatorLabel": "Populated area",
    "analytics": [
      {
        "calculation": "sum",
        "value": 35506395973559.5,
        "quality": 8.631925971757898
      },
      {
        "calculation": "min",
        "value": 2215179915.1768827,
        "quality": 5.237166563552765
      },
      {
        "calculation": "max",
        "value": 2945986283.9038973,
        "quality": 4.623907255907833
      },
      {
        "calculation": "mean",
        "value": 2755851907.2927275,
        "quality": 4.822905251274225
      },
      {
        "calculation": "stddev",
        "value": 129045427.91210109,
        "quality": 4.352175213553889
      },
      {
        "calculation": "median",
        "value": 2827463240.4368477,
        "quality": 4.834046342745139
      }
    ]
  },
  {
    "numerator": "covid19_vaccines",
    "denominator": "populated_area_km2",
    "numeratorLabel": "COVID19 Vaccine Acceptance",
    "denominatorLabel": "Populated area",
    "analytics": [
      {
        "calculation": "sum",
        "value": 0,
        "quality": 0
      },
      {
        "calculation": "min",
        "value": 0,
        "quality": 0
      },
      {
        "calculation": "max",
        "value": 0,
        "quality": 0
      },
      {
        "calculation": "mean",
        "value": 0,
        "quality": 0
      },
      {
        "calculation": "stddev",
        "value": 0,
        "quality": 0
      },
      {
        "calculation": "median",
        "value": 0,
        "quality": 0
      }
    ]
  },
  {
    "numerator": "days_maxtemp_over_32c_1c",
    "denominator": "populated_area_km2",
    "numeratorLabel": "Days above 32C, recent scenario",
    "denominatorLabel": "Populated area",
    "analytics": [
      {
        "calculation": "sum",
        "value": 2108142.1314187595,
        "quality": 9.399305054721143
      },
      {
        "calculation": "min",
        "value": 5.769026884065672,
        "quality": 4.227275820860739
      },
      {
        "calculation": "max",
        "value": 483.0181093118385,
        "quality": 5.986065263503529
      },
      {
        "calculation": "mean",
        "value": 158.6620103423466,
        "quality": 5.576908115380704
      },
      {
        "calculation": "stddev",
        "value": 97.89953676663461,
        "quality": 5.945604981263488
      },
      {
        "calculation": "median",
        "value": 134.52472872297173,
        "quality": 5.505237287564495
      }
    ]
  },
  {
    "numerator": "days_maxtemp_over_32c_1c",
    "denominator": "area_km2",
    "numeratorLabel": "Days above 32C, recent scenario",
    "denominatorLabel": "Area",
    "analytics": [
      {
        "calculation": "sum",
        "value": 2785671.2330422853,
        "quality": 11.17158759163595
      },
      {
        "calculation": "min",
        "value": 2.467236041314042,
        "quality": 5.895473079427823
      },
      {
        "calculation": "max",
        "value": 483.0181093118385,
        "quality": 7.490112374738184
      },
      {
        "calculation": "mean",
        "value": 169.25940169171741,
        "quality": 7.256240529311757
      },
      {
        "calculation": "stddev",
        "value": 109.99289238294091,
        "quality": 7.095403983832961
      },
      {
        "calculation": "median",
        "value": 137.93071760219044,
        "quality": 7.167348723626826
      }
    ]
  }]`;

export const advancedAnalyticsResourceAtom = createResourceAtom(
  focusedGeometryAtom,
  async (fGeo) => {
    return JSON.parse(json);
  },
  'advancedAnalyticsResource',
);
