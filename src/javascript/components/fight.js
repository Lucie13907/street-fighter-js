import controls from '../../constants/controls';

export function getHitPower(fighter) {
    const criticalHitChance = Math.random() + 1;

    return fighter.attack * criticalHitChance;
}

export function getBlockPower(fighter) {
    const dodgeChance = Math.random() + 1;

    return fighter.defense * dodgeChance;
}

export function getDamage(attacker, defender) {
    const damage = getHitPower(attacker) - getBlockPower(defender);

    return damage > 0 ? damage : 0;
}

export async function fight(firstFighter, secondFighter) {
    return new Promise(resolve => {
        let firstFighterHealth = firstFighter.health;
        let secondFighterHealth = secondFighter.health;

        const pressedKeys = {};

        let firstCriticalReady = true;
        let secondCriticalReady = true;

        const firstHealthBar = document.getElementById('left-fighter-indicator');
        const secondHealthBar = document.getElementById('right-fighter-indicator');

        function updateHealthBar(barElement, health, maxHealth) {
            const healthPercent = (health / maxHealth) * 100;
            const healthBar = barElement;

            healthBar.style.width = `${healthPercent}%`;
        }

        const keyUpHandler = event => {
            delete pressedKeys[event.code];
        };

        const keyDownHandler = event => {
            pressedKeys[event.code] = true;

            if (event.code === controls.PlayerOneAttack && !pressedKeys[controls.PlayerOneBlock]) {
                if (!pressedKeys[controls.PlayerTwoBlock]) {
                    const damage = getDamage(firstFighter, secondFighter);

                    secondFighterHealth -= damage;

                    updateHealthBar(secondHealthBar, secondFighterHealth, secondFighter.health);
                }
            }

            if (event.code === controls.PlayerTwoAttack && !pressedKeys[controls.PlayerTwoBlock]) {
                if (!pressedKeys[controls.PlayerOneBlock]) {
                    const damage = getDamage(secondFighter, firstFighter);

                    firstFighterHealth -= damage;

                    updateHealthBar(firstHealthBar, firstFighterHealth, firstFighter.health);
                }
            }

            if (controls.PlayerOneCriticalHitCombination.every(key => pressedKeys[key]) && firstCriticalReady) {
                secondFighterHealth -= firstFighter.attack * 2;

                updateHealthBar(secondHealthBar, secondFighterHealth, secondFighter.health);

                firstCriticalReady = false;

                setTimeout(() => {
                    firstCriticalReady = true;
                }, 10000);
            }

            if (controls.PlayerTwoCriticalHitCombination.every(key => pressedKeys[key]) && secondCriticalReady) {
                firstFighterHealth -= secondFighter.attack * 2;

                updateHealthBar(firstHealthBar, firstFighterHealth, firstFighter.health);

                secondCriticalReady = false;

                setTimeout(() => {
                    secondCriticalReady = true;
                }, 10000);
            }

            if (firstFighterHealth <= 0) {
                document.removeEventListener('keydown', keyDownHandler);
                document.removeEventListener('keyup', keyUpHandler);

                resolve(secondFighter);
            }

            if (secondFighterHealth <= 0) {
                document.removeEventListener('keydown', keyDownHandler);
                document.removeEventListener('keyup', keyUpHandler);

                resolve(firstFighter);
            }
        };

        document.addEventListener('keydown', keyDownHandler);
        document.addEventListener('keyup', keyUpHandler);
    });
}
