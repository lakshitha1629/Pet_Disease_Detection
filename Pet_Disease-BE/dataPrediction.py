import pickle
import pandas as pd
import json

def predict_mpg(preValueList):
    valueList = [x.replace(' ', '') for x in preValueList]
    outputList = []

    for item in valueList:
        if([ele1 for ele1 in ['Diarrhea', 'Emaciation', 'Seizures', 'Lossofappetite', 'Failuretothrive', 'Lossofappetite', 'Intestinalblockages', 'Intestinalcompliations', 'Tapewormsinfeces'] if(ele1 in item)]):
            outputList.append("Feline Ringworms")
            
        elif([ele for ele in ['Hairloss', 'Itchiness', 'Flakyskin', 'Irritatedskin', 'Redskin']if(ele in item)]):
            outputList.append("Feline Mange")
            
        elif([ele2 for ele2 in ['Diarrhea', 'Emaciation', 'Seizures', 'Shaggycoat', 'Lossofappetite', 'Failuretothrive', 'Lossofappetite', 'Intestinalblockages', 'Intestinalcompliations', 'Tapewormsinfeces'] if(ele2 in item)]):
            outputList.append("Feline Tapeworms")
            
        elif([ele3 for ele3 in ['Ascites(Swellingofabdomen)', 'Lethargy', 'Lossofappetite', 'Increasedthrist', 'Frequenturination', 'Weightloss', 'Vomiting', 'Diarrhea', 'Diarrhea', 'Yellowskin', 'Yelloweyes', 'Yellowgums', 'Excessivedrooling'] if(ele3 in item)]):
            outputList.append("Feline Liver Disease")
            
        elif([ele4 for ele4 in ['Strainingtourinate', 'Urinatingsmallamounts', 'Frequentattemptstourinate', 'Prolongedattemptstourinate', 'Cryingoutwhileurinating', 'Excessivelickingofgenitalareas', 'Urinatingoutsidethelitterbox', 'Bloodinurine', 'Distress'] if(ele4 in item)]):
            outputList.append("Feline Lower Urinary Tract Disease (FLUTD)")
                
        elif([ele5 for ele5 in ['Fever', 'Lethargy', 'Lossofappetite', 'Weakness', 'Paralysisofhindlegs', 'Seizures', 'Drooling', 'Aggression', 'Depression', 'Coma', 'Lossofmusclecontrol', 'Foamingatmouth', 'Suddendeath'] if(ele5 in item)]):
            outputList.append("Feline Rabies")
            
        elif([ele6 for ele6 in ['Anemia', 'Fever', 'Lethargy', 'Lossofappetite', 'Weightloss', 'Musclestiffness', 'Fever', 'Jointpain', 'Swellinginjoints', 'Increasedthirst', 'Frequenturination', 'Ulcer', 'Twitching', 'Seizures', 'Twitching', 'Hairloss', 'Skincolorchanges', 'Crustyskin'] if(ele6 in item)]):
            outputList.append("Canine Lupus")
            
        elif([ele7 for ele7 in ['Pimple-likelesions', 'Acne', 'Rash', 'Inflamedskin', 'Pusfilledblisters', 'Hairloss', 'Crustyskin', 'Scratchinginfectedareas', 'Lickinginfectedareas', 'Bitinginfectedareas', 'Depression', 'Weightloss'] if(ele7 in item)]):
            outputList.append("Canine Impetigo")
                    
        elif([ele8 for ele8 in ['Hairloss', 'Irritatedskin', 'Rash', 'Thickyellowcrusts', 'Bacteriainfection', 'Yeastinfection', 'Itchiness', 'Thickeningofskin', 'Lymphnodeinflammation', 'Emaciation'] if(ele8 in item)]):
            outputList.append("Canine Mange")
                
        elif([ele for ele in ['Coughing', 'Dyspnea', 'Pneumonia', 'Diarrhea', 'Vomiting', 'Purulentnasaldischarge', 'Enamelhypoplasia', 'Hyperkeratosis', 'Circling', 'Headtilt', 'Nystagmus', 'Partialparalysis', 'Completeparalysis', 'Convulsion', 'Dementia', 'Involuntaryjerkytwitching', 'Musclescontraction', 'Convulsioncontraction'] if(ele in item)]):
            outputList.append("Canine Distemper")
                
        elif([ele for ele in ['Lossofappetite', 'Abdominalpain', 'Abdominalbloating', 'Bloodydiarrhea', 'Diarrhea', 'Vomiting', 'Dehydration'] if(ele in item)]):
            outputList.append("Canine Parvovirus")
            
        elif([ele for ele in ['Laboredbreathing', 'Coughing', 'Vomiting', 'Weightloss', 'Weakness', 'Coughing', 'Fatigue'] if(ele in item)]):
            outputList.append("Canine Heartworm")
            
        elif([ele for ele in ['Restlessness', 'Aggression', 'Irritability', 'Apprehension', 'Biting', 'Snappingatanyformofstimulus', 'Licking', 'Chewing', 'Fever', 'Hidingindarkplaces', 'Eatingunusualobjects', 'Paralysisofthroat', 'Paralysisofthroat', 'Paralysisofjawmuscles', 'Foamingatmouth', 'Disorientation', 'Incoordination', 'Staggering', 'Paralysisofhindlegs', 'Lossofappetite', 'Weakness', 'Seizures', 'Suddendeath'] if(ele in item)]):
            outputList.append("Canine Rabies")
            
        else:
            outputList.append("out of range")

    return outputList

