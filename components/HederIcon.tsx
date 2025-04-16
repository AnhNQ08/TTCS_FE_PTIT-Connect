import { View, StyleSheet } from 'react-native';
import { Badge } from 'react-native-paper';

export default function HeaderIcon(props: any) {
    const iconTag = props.iconTag;
    const countNotification = props.countNotification;

    return (
        <View
            style={styles.container}
        >
            {iconTag}
            {countNotification > 0 && (
                <Badge style={styles.badge}>{countNotification}</Badge>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    badge: {
        position: 'absolute',
        top: -5,
        left: 13,
        backgroundColor: 'red',
    },
    iconButton: {
        position: 'relative',
    },
});
