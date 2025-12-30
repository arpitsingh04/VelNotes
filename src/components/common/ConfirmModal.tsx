import React from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { COLORS, SPACING, BORDER_RADIUS } from '../../constants/theme';
import { useTheme } from '../../store/ThemeContext';

interface ConfirmModalProps {
    visible: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
    onCancel: () => void;
    confirmText?: string;
    cancelText?: string;
    isDestructive?: boolean;
    secondaryText?: string;
    onSecondaryAction?: () => void;
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
    visible,
    title,
    message,
    onConfirm,
    onCancel,
    confirmText = 'Confirm',
    cancelText = 'Cancel',
    isDestructive = false,
    secondaryText,
    onSecondaryAction,
}) => {
    const { theme } = useTheme();
    const colors = COLORS[theme];

    return (
        <Modal visible={visible} transparent animationType="fade">
            <View style={styles.overlay}>
                <View style={[styles.container, { backgroundColor: colors.surface }]}>
                    <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
                    <Text style={[styles.message, { color: colors.textSecondary }]}>{message}</Text>

                    <View style={styles.footer}>
                        <TouchableOpacity onPress={onCancel} style={styles.button}>
                            <Text style={[styles.buttonText, { color: colors.textSecondary }]}>{cancelText}</Text>
                        </TouchableOpacity>

                        {secondaryText && onSecondaryAction && (
                            <TouchableOpacity onPress={onSecondaryAction} style={styles.button}>
                                <Text style={[styles.buttonText, { color: colors.error }]}>{secondaryText}</Text>
                            </TouchableOpacity>
                        )}

                        <TouchableOpacity
                            onPress={onConfirm}
                            style={[styles.button, isDestructive && { backgroundColor: colors.error + '20', borderRadius: BORDER_RADIUS.md }]}
                        >
                            <Text style={[styles.buttonText, { color: isDestructive ? colors.error : colors.primary }]}>
                                {confirmText}
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: SPACING.xl,
    },
    container: {
        width: '100%',
        padding: SPACING.lg,
        borderRadius: BORDER_RADIUS.lg,
        elevation: 5,
    },
    title: {
        fontSize: 20,
        fontWeight: '700',
        marginBottom: SPACING.sm,
    },
    message: {
        fontSize: 16,
        lineHeight: 24,
        marginBottom: SPACING.xl,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
    },
    button: {
        paddingHorizontal: SPACING.md,
        paddingVertical: SPACING.sm,
        marginLeft: SPACING.sm,
    },
    buttonText: {
        fontSize: 16,
        fontWeight: '600',
    },
});
