<script lang="ts">
  import './button.css';

  /**
   * Is this the principal call to action on the page?
   */
  export let primary = false;
  export let danger = false;

  /**
   * What background color to use
   */
  export let backgroundColor: string | undefined = undefined;
  /**
   * How large should the button be?
   */
  export let size: 'pill' | 'small' | 'medium' | 'large' | 'text' = 'medium';
  /**
   * Button contents
   */
  export let label: string = '';

  $: mode = primary
    ? 'storybook-button--primary'
    : danger
      ? 'storybook-button--danger'
      : 'storybook-button--secondary';

  $: style = backgroundColor ? `background-color: ${backgroundColor}` : '';
</script>

<button
  type="button"
  class={['storybook-button', `storybook-button--${size}`, mode].join(' ')}
  {style}
  on:click
>
  {label}
</button>
