import Fragment from "./fragment";
export default abstract class DialogFragment extends Fragment {
    onCreateDialog(): any;
    onPositiveClick(): void;
    onNegativeClick(): void;
}
