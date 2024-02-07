import { View, FlatList, Pressable } from 'react-native';
import { TextInput, Text, Button   } from 'react-native-paper';
import { useState } from 'react';

function Autocomplete( {options, addFunction, id} ) {
    console.log("autocomplete", options);
    const [value, setValue] = useState(null);  
    const [input, setInput] = useState("");
    const [valueSelected, setValueSelected] = useState(false);
    const [filtered_options, setFilteredOptions] = useState([])

    var clearSelection = function() {
        setValue(null);
        setInput("");
        setValueSelected(false);
    };

    return (
        <View style={{padding:10}}>
            { valueSelected ? 
                <View>
                    <View style={{display:"flex",flexDirection:"row"}}>
                        <Pressable style={{padding:10}} onPress={ ()=> clearSelection() }>
                            <Text> - </Text>
                        </Pressable>
                        <Text style={{padding:10}}>{value.name}</Text>
                    </View>
                    <Button mode="contained-tonal" onPress={() => {
                            addFunction(value[id]);
                            clearSelection();
                        }
                    }>
                        Add
                    </Button>
                </View>
                :
                <View>
                    <TextInput label='Workout' mode='outlined' onChangeText={(text) => {
                        setInput(text);
                        setFilteredOptions(options.filter(item => {
                            var length = text.length; 
                        
                            if (length > 0 && length <= item.name.length) {
                                return item.name.toLowerCase().substring(0, length) == text.toLowerCase(); 
                            }

                            return false;
                        }));
                    }} value={input} />
                    { (input != "") &&
                    <FlatList 
                        data={filtered_options}
                        keyExtractor={item => item[id]}
                        renderItem={(selected) => 
                            <View style={{padding:10, margin:2}}>
                                <Pressable onPress={() => {
                                    setValue(selected.item);
                                    setInput("");
                                    setValueSelected(true);
                                }}>
                                    <Text>{selected.item.name}</Text>
                                </Pressable>
                            </View>
                        }
                    />
                    }

                </View>
            }


        </View>
    );
}

export default Autocomplete;